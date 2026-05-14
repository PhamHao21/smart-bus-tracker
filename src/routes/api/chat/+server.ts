/**
 * src/routes/api/chat/+server.ts — Server Route Proxy cho Groq API
 * ─────────────────────────────────────────────────────────────────────
 * MỤC ĐÍCH BẢO MẬT:
 *   Client (browser) GỬI request đến /api/chat (cùng origin).
 *   Server (SvelteKit) NHẬN và gọi Groq API với GROQ_API_KEY.
 *   GROQ_API_KEY KHÔNG BAO GIỜ xuất hiện trong browser bundle.
 *
 * STREAMING:
 *   Response được stream theo từng chunk (Server-Sent Events style),
 *   giúp chatbot hiển thị text từng từ thay vì chờ toàn bộ response.
 *
 * REQUEST body:
 *   {
 *     message: string,          ← Câu hỏi của user
 *     history?: ChatMessage[]   ← Lịch sử cuộc hội thoại (optional)
 *   }
 *
 * RESPONSE:
 *   ReadableStream của text chunks (text/event-stream)
 */

import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { GROQ_API_KEY } from "$env/static/private";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
}

const SYSTEM_PROMPT = `Bạn là trợ lý AI của SmartBus Tracker — ứng dụng theo dõi xe buýt thành phố Cần Thơ.

NHIỆM VỤ:
- Tư vấn lộ trình xe buýt tại Cần Thơ dựa trên thông tin 5 tuyến bên dưới.
- Trả lời ngắn gọn, thân thiện, dễ hiểu bằng tiếng Việt (trừ khi user dùng tiếng Anh).
- Nếu không có thông tin trong dữ liệu cung cấp, hãy nói rõ là chưa có dữ liệu — KHÔNG bịa.

THÔNG TIN 5 TUYẾN XE BUÝT CẦN THƠ (MVP):

🚌 TUYẾN 1 — Ô Môn (màu Cyan)
  Lộ trình: Bến Xe Trung Tâm → Ô Môn
  Giá vé: 7.000đ | Tốc độ TB: 30 km/h | 14 trạm dừng
  Đặc điểm: Tuyến hướng Bắc, qua khu vực Thốt Nốt trước khi rẽ Ô Môn

🚌 TUYẾN 2 — Thốt Nốt (màu Magenta/Hồng)
  Lộ trình: Bến Xe Trung Tâm → Thốt Nốt
  Giá vé: 12.000đ | Tốc độ TB: 35 km/h | 21 trạm dừng
  Đặc điểm: Tuyến dài nhất, đi qua Ô Môn, đến tận Quận Thốt Nốt phía Bắc

🚌 TUYẾN 3 — ĐH Cần Thơ (màu Xanh lá)
  Lộ trình: Bến Xe Trung Tâm → Đại Học Cần Thơ
  Giá vé: 5.000đ | Tốc độ TB: 25 km/h | 10 trạm dừng
  Đặc điểm: Tuyến ngắn nhất, phục vụ sinh viên, đi về phía Tây Bắc

🚌 TUYẾN 4 — Cái Răng (màu Vàng)
  Lộ trình: Bến Xe Trung Tâm → Cái Răng
  Giá vé: 7.000đ | Tốc độ TB: 28 km/h | 15 trạm dừng
  Đặc điểm: Tuyến hướng Nam, qua Chợ Nổi Cái Răng nổi tiếng

🚌 TUYẾN 5 — Phong Điền (màu Tím)
  Lộ trình: Bến Xe Trung Tâm → Phong Điền
  Giá vé: 9.000đ | Tốc độ TB: 30 km/h | 18 trạm dừng
  Đặc điểm: Tuyến hướng Tây Nam, qua khu vực vườn trái cây Phong Điền

ĐIỂM XUẤT PHÁT CHUNG: Bến Xe Trung Tâm Cần Thơ (Quận Ninh Kiều)
Tọa độ trung tâm: 10.005719°N, 105.772785°E

QUY TẮC TRẢ LỜI:
- Ưu tiên tuyến trực tiếp trước khi đề xuất đổi xe.
- Luôn nêu rõ: số tuyến, điểm đầu/cuối, giá vé, thời gian ước tính.
- Nếu hỏi về địa điểm không liên quan đến 5 tuyến trên → nói rõ chưa có dữ liệu.
- Câu trả lời ngắn gọn (≤ 4 câu) trừ khi user yêu cầu chi tiết.
- Thái độ thân thiện, dùng emoji nhẹ nhàng (🚌, 📍, ⏱️, 💰).`;

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests
const RATE_WINDOW_MS = 60_000; // per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

function sanitizeMessage(msg: unknown): string {
  if (typeof msg !== "string") throw new Error("message phải là string");
  const trimmed = msg.trim();
  if (trimmed.length === 0) throw new Error("message không được để trống");
  if (trimmed.length > 1000)
    throw new Error("message quá dài (tối đa 1000 ký tự)");
  return trimmed;
}

function sanitizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m): m is ChatMessage =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  if (!GROQ_API_KEY) {
    console.error("[/api/chat] GROQ_API_KEY chưa được cấu hình trong .env");
    throw error(500, "AI service chưa được cấu hình. Liên hệ admin.");
  }

  const clientIp = getClientAddress();
  if (!checkRateLimit(clientIp)) {
    throw error(429, "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.");
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    throw error(400, "Request body không hợp lệ (cần JSON).");
  }

  let userMessage: string;
  let history: ChatMessage[];
  try {
    userMessage = sanitizeMessage(body.message);
    history = sanitizeHistory(body.history);
  } catch (e: unknown) {
    throw error(400, (e as Error).message);
  }

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history,
    { role: "user" as const, content: userMessage },
  ];

  let groqResponse: Response;
  try {
    groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          stream: true,
          max_tokens: 600,
          temperature: 0.5,
          top_p: 0.9,
        }),
      },
    );
  } catch (e: unknown) {
    console.error("[/api/chat] Lỗi kết nối Groq:", (e as Error).message);
    throw error(503, "Không thể kết nối đến AI service. Thử lại sau.");
  }

  if (!groqResponse.ok) {
    const errText = await groqResponse.text().catch(() => "Unknown error");
    console.error(
      `[/api/chat] Groq API error ${groqResponse.status}:`,
      errText,
    );

    if (groqResponse.status === 401) {
      throw error(500, "API key không hợp lệ. Liên hệ admin.");
    }
    if (groqResponse.status === 429) {
      throw error(429, "AI service đang quá tải. Thử lại sau vài giây.");
    }
    throw error(502, "AI service trả về lỗi. Thử lại sau.");
  }

  const groqBody = groqResponse.body;
  if (!groqBody) {
    throw error(502, "Groq không trả về response body.");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = groqBody.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                const sse = `data: ${JSON.stringify({ token: delta })}\n\n`;
                controller.enqueue(new TextEncoder().encode(sse));
              }
            } catch {
              console.warn("[/api/chat] Không thể parse chunk:", data);
            }
          }
        }
      } catch (err: unknown) {
        console.error("[/api/chat] Stream error:", (err as Error).message);
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ error: "Stream bị ngắt. Thử lại." })}\n\n`,
          ),
        );
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
};
