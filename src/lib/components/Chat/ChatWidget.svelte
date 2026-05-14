<script lang="ts">
  import { tick } from 'svelte';

  interface Message {
    id:          string;
    role:        'user' | 'assistant';
    content:     string;
    isStreaming: boolean;
    timestamp:   Date;
  }

  interface HistoryEntry {
    role:    'user' | 'assistant';
    content: string;
  }


  let isOpen      = $state(false);
  let inputText   = $state('');
  let isLoading   = $state(false);
  let messages    = $state<Message[]>([]);

  let messagesContainer = $state<HTMLElement | undefined>(undefined);
  let inputEl           = $state<HTMLTextAreaElement | undefined>(undefined);

  const QUICK_PROMPTS: string[] = [
    'Xe buýt đến ĐH Cần Thơ đi tuyến nào?',
    'Giá vé tuyến Thốt Nốt bao nhiêu?',
    'Từ bến xe đến Cái Răng mất bao lâu?',
    'Có tuyến xe đến Phong Điền không?',
  ];


  const canSend = $derived(!isLoading && inputText.trim().length > 0);
  const showQuickPrompts = $derived(messages.length <= 1);

  function genId(): string {
    return Math.random().toString(36).slice(2, 9);
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  async function scrollToBottom(): Promise<void> {
    await tick();
    messagesContainer?.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
  }

  async function sendMessage(text?: string): Promise<void> {
    const content = (text ?? inputText).trim();
    if (!content || isLoading) return;

    inputText = '';

    messages = [...messages, {
      id: genId(), role: 'user', content,
      isStreaming: false, timestamp: new Date(),
    }];
    await scrollToBottom();

    const assistantId = genId();
    messages = [...messages, {
      id: assistantId, role: 'assistant', content: '',
      isStreaming: true, timestamp: new Date(),
    }];
    isLoading = true;
    await scrollToBottom();

    const history: HistoryEntry[] = messages
      .filter((m) => !m.isStreaming && m.id !== assistantId)
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: `HTTP ${res.status}` })) as { message?: string };
        throw new Error(errData.message ?? `HTTP ${res.status}`);
      }

      if (!res.body) throw new Error('Không có response body');

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data) as { token?: string; error?: string };
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.token) {
              messages = messages.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + parsed.token }
                  : m
              );
              await scrollToBottom();
            }
          } catch (parseErr) {
            const msg = parseErr instanceof Error ? parseErr.message : '';
            if (msg && !msg.includes('JSON')) throw parseErr;
          }
        }
      }

      messages = messages.map((m) =>
        m.id === assistantId ? { ...m, isStreaming: false } : m
      );

    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Lỗi không xác định';
      messages = messages.map((m) =>
        m.id === assistantId
          ? { ...m, content: `⚠️ ${errMsg}`, isStreaming: false }
          : m
      );
    } finally {
      isLoading = false;
      await scrollToBottom();
    }
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function toggleChat(): Promise<void> {
    isOpen = !isOpen;
    if (isOpen) {
      await tick();
      inputEl?.focus();
      if (messages.length === 0) {
        messages = [{
          id: genId(), role: 'assistant',
          content: 'Xin chào! 👋 Tôi là trợ lý SmartBus.\nBạn cần đi đâu tại Cần Thơ? 🚌',
          isStreaming: false, timestamp: new Date(),
        }];
      }
    }
  }

  function clearHistory(): void {
    messages = [];
    inputText = '';
  }
</script>

<button
  class="chat-toggle"
  onclick={toggleChat}
  aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot AI'}
>
  {#if isOpen}
    <span class="toggle-icon">✕</span>
  {:else}
    <span class="toggle-icon">🤖</span>
    <span class="toggle-label">AI Chat</span>
  {/if}
</button>

{#if isOpen}
  <div class="chat-panel" role="dialog" aria-label="SmartBus AI Chatbot">

    <div class="chat-header">
      <div class="chat-header-info">
        <div class="ai-avatar">🤖</div>
        <div>
          <div class="chat-title">SmartBus AI</div>
          <div class="chat-subtitle">
            {isLoading ? '⚡ Đang trả lời...' : '🟢 Sẵn sàng'}
          </div>
        </div>
      </div>
      <div class="chat-header-actions">
        <button class="icon-btn" onclick={clearHistory} title="Xóa lịch sử">🗑</button>
        <button class="icon-btn" onclick={toggleChat} title="Đóng">✕</button>
      </div>
    </div>

    <div class="chat-messages" bind:this={messagesContainer}>
      {#if messages.length === 0}
        <div class="empty-state">
          <div class="empty-icon">🚌</div>
          <p>Hỏi tôi về tuyến xe buýt Cần Thơ!</p>
        </div>
      {/if}

      {#each messages as msg (msg.id)}
        <div class="message-row {msg.role}">
          {#if msg.role === 'assistant'}
            <div class="msg-avatar">🤖</div>
          {/if}

          <div class="message-bubble {msg.role}">
            <div class="message-content">
              {#if msg.isStreaming && msg.content === ''}
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              {:else}
                {msg.content}{#if msg.isStreaming}<span class="cursor-blink">▋</span>{/if}
              {/if}
            </div>
            <div class="message-time">{formatTime(msg.timestamp)}</div>
          </div>

          {#if msg.role === 'user'}
            <div class="msg-avatar user">👤</div>
          {/if}
        </div>
      {/each}
    </div>

    {#if showQuickPrompts}
      <div class="quick-prompts">
        {#each QUICK_PROMPTS as prompt (prompt)}
          <button
            class="quick-prompt-btn"
            onclick={() => sendMessage(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </button>
        {/each}
      </div>
    {/if}

    <div class="chat-input-area">
      <textarea
        bind:this={inputEl}
        bind:value={inputText}
        onkeydown={handleKeyDown}
        placeholder="Hỏi về tuyến xe buýt... (Enter để gửi)"
        disabled={isLoading}
        rows={1}
        class="chat-input"
      ></textarea>
      <button
        class="send-btn"
        onclick={() => sendMessage()}
        disabled={!canSend}
        aria-label="Gửi tin nhắn"
      >
        {isLoading ? '⏳' : '🚀'}
      </button>
    </div>
  </div>
{/if}

<style>
  .chat-toggle {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 18px;
    border-radius: 30px;
    background: rgba(18, 26, 46, 0.9);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(157, 92, 255, 0.5);
    color: #9D5CFF;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(157, 92, 255, 0.3), 0 4px 16px rgba(0,0,0,0.4);
    transition: all 0.2s ease;
  }

  .chat-toggle:hover {
    border-color: rgba(157, 92, 255, 0.8);
    box-shadow: 0 0 32px rgba(157, 92, 255, 0.5), 0 4px 20px rgba(0,0,0,0.5);
    transform: translateY(-2px);
  }

  .toggle-icon { font-size: 18px; }
  .toggle-label { letter-spacing: 0.03em; }

  .chat-panel {
    position: fixed;
    bottom: 84px;
    right: 24px;
    z-index: 999;
    width: 360px;
    max-height: 580px;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    background: rgba(12, 18, 36, 0.92);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(157, 92, 255, 0.3);
    box-shadow: 0 0 40px rgba(157, 92, 255, 0.2), 0 16px 48px rgba(0,0,0,0.6);
    animation: slideUp 0.25s cubic-bezier(0.33, 1, 0.68, 1);
    overflow: hidden;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(157, 92, 255, 0.08);
    flex-shrink: 0;
  }

  .chat-header-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ai-avatar {
    font-size: 22px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(157, 92, 255, 0.15);
    border: 1px solid rgba(157, 92, 255, 0.4);
    border-radius: 50%;
  }

  .chat-title {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #E8F6FF;
  }

  .chat-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    color: #6B7A9A;
    margin-top: 1px;
  }

  .chat-header-actions { display: flex; gap: 6px; }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: 4px 6px;
    border-radius: 6px;
    color: #6B7A9A;
    transition: all 0.15s ease;
  }

  .icon-btn:hover {
    background: rgba(255,255,255,0.08);
    color: #E8F6FF;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 200px;
    max-height: 340px;
  }

  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb {
    background: rgba(157, 92, 255, 0.3);
    border-radius: 2px;
  }

  .empty-state {
    text-align: center;
    color: #6B7A9A;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    padding: 20px;
  }

  .empty-icon { font-size: 32px; margin-bottom: 8px; }

  .message-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  .message-row.user { flex-direction: row-reverse; }

  .msg-avatar {
    font-size: 18px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(157, 92, 255, 0.15);
    border: 1px solid rgba(157, 92, 255, 0.3);
    flex-shrink: 0;
  }

  .msg-avatar.user {
    background: rgba(0, 234, 255, 0.1);
    border-color: rgba(0, 234, 255, 0.3);
  }

  .message-bubble {
    max-width: 78%;
    border-radius: 14px;
    padding: 10px 13px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    line-height: 1.55;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .message-bubble.assistant {
    background: rgba(157, 92, 255, 0.1);
    border: 1px solid rgba(157, 92, 255, 0.2);
    border-bottom-left-radius: 4px;
    color: #E8F6FF;
  }

  .message-bubble.user {
    background: rgba(0, 234, 255, 0.12);
    border: 1px solid rgba(0, 234, 255, 0.25);
    border-bottom-right-radius: 4px;
    color: #E8F6FF;
  }

  .message-content { color: #E8F6FF; }

  .message-time {
    font-size: 10px;
    color: #3F4B68;
    margin-top: 4px;
    text-align: right;
  }

  .cursor-blink {
    animation: blink 0.8s step-end infinite;
    color: #9D5CFF;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 2px 0;
  }

  .typing-indicator span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #9D5CFF;
    animation: typingDot 1.2s ease-in-out infinite;
    box-shadow: 0 0 6px #9D5CFF;
  }

  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  .quick-prompts {
    padding: 0 14px 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex-shrink: 0;
  }

  .quick-prompt-btn {
    padding: 5px 10px;
    border-radius: 16px;
    background: rgba(157, 92, 255, 0.08);
    border: 1px solid rgba(157, 92, 255, 0.3);
    color: #9D5CFF;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }

  .quick-prompt-btn:hover:not(:disabled) {
    background: rgba(157, 92, 255, 0.18);
    border-color: rgba(157, 92, 255, 0.6);
  }

  .quick-prompt-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .chat-input-area {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 12px 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
    background: rgba(157, 92, 255, 0.04);
  }

  .chat-input {
    flex: 1;
    resize: none;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(157, 92, 255, 0.25);
    border-radius: 10px;
    padding: 10px 12px;
    color: #E8F6FF;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    line-height: 1.5;
    max-height: 100px;
    overflow-y: auto;
    transition: border-color 0.15s ease;
  }

  .chat-input::placeholder { color: #3F4B68; }

  .chat-input:focus {
    outline: none;
    border-color: rgba(157, 92, 255, 0.6);
    box-shadow: 0 0 0 3px rgba(157, 92, 255, 0.1);
  }

  .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }

  .send-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(157, 92, 255, 0.2);
    border: 1px solid rgba(157, 92, 255, 0.5);
    color: #9D5CFF;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .send-btn:hover:not(:disabled) {
    background: rgba(157, 92, 255, 0.35);
    box-shadow: 0 0 16px rgba(157, 92, 255, 0.4);
    transform: scale(1.05);
  }

  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes typingDot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30%            { transform: translateY(-5px); opacity: 1; }
  }

  @media (max-width: 640px) {
    .chat-panel {
      right: 12px;
      left: 12px;
      width: auto;
      bottom: 76px;
    }
    .chat-toggle {
      right: 16px;
      bottom: 16px;
    }
  }
</style>