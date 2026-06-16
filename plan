DỰ ÁN SMARTBUS TRACKER

I.TỔNG QUAN
1.Bảng phân công
Đây là bộ tài liệu thiết kế (Design & Planning) cho dự án Ứng dụng theo dõi tuyến xe buýt giả lập thời gian thực.
File	Nội dung	Vai trò
Plan	Kế hoạch phát triển chi tiết theo 6 giai đoạn, từ thiết kế đến triển khai	Product Manager
System Architecture	Kiến trúc hệ thống, cấu trúc thư mục SvelteKit + Node.js, Sequence Diagram, ERD	System Architect
Ai Integration	Logic AI Predictor & AI Assistant, cách kết nối OpenAI và RAG	AI Engineer
Ui Theme 	Design system Dark Mode Digital Twin: color tokens, Glassmorphism, motion, a11y	UI/UX Designer
3D Rendering	Pipeline 3D: Threlte + Mapbox + Instanced Rendering + GPS Interpolation + Postprocessing  	Engineer 3D

2.Stack Công Nghệ
Frontend
 SvelteKit + TypeScript
 Mapbox GL JS — Base map + 3D Buildings
 Threlte + Three.js — 3D scene (xe buýt .glb, landmarks)
 postprocessing — Bloom, FXAA, Light trail
 Tailwind CSS + Glassmorphism + Neon tokens
Backend
 Node.js + Express + TypeScript
 Firebase Admin SDK
Database & Services
 Firebase Firestore (persistent data)
 Firebase Realtime DB (live GPS)
 Firebase Auth
 Cloudflare R2 / Firebase Storage (3D assets CDN)
AI
 OpenAI GPT4omini + RAG + Function Calling (Assistant)
 Heuristic model (Predictor v1), XGBoost (v2)
Deploy
 Vercel (Frontend)
 Google Cloud Run (Backend)
 Cloudflare CDN (3D assets)

3.Tính Năng Nổi Bật 
Hybrid View 2D ↔ 3D — Toggle mượt giữa topdown và perspective (1.2s easeOutCubic).
3D Bus Fleet — Mô hình .glb với Instanced Rendering (60 FPS với 50 xe).
Dark Digital Twin Theme — Glassmorphism panels, Neon glow, Grid overlay.
Postprocessing — Bloom effect cho xe/trail, Light trail kéo dài theo chuyển động.
3D Landmarks Cần Thơ — Buildings layer + custom glow shader (cyan/magenta edges).
AI Assistant tương tác 3D — Chatbot có thể chuyển view, phóng đến xe/trạm qua Function Calling.
GPS Interpolation — LERP smooth giữa các tick GPS 2s → xe chạy mượt không giật.

4.Cách Sử Dụng Tài Liệu
Bắt đầu: Đọc `README.md` (file này) để nắm tổng quan.
PM: Mở `plan.md` để xem timeline, nhân sự, rủi ro.
System Aitect: Xem `system_architecture.md` cho cấu trúc thư mục, sequence diagram, ERD.
Frontend Engineer (3D): Xem `3d_rendering.md` để implement Threlte, Mapbox, interpolation, instanced rendering.
UI/UX Designer: Xem `ui_theme.md` để biết color tokens, Glassmorphism recipe, typography.
AI Engineer: Xem `ai_integration.md` để triển khai Predictor và Assistant với function caling.

5.Sơ Đồ Xem Trực Tiếp
Các sơ đồ Mermaid (Architecture, Sequence Diaram, ERD, 3D Pipeline flow) có thể xem trực tiếp trên:
 GitHub (hỗ trợ render Mermaid natively)
 VSCode với extension "Markdown Preview Mermaid Support"
 mermaid.live  dán code vào web


II.KẾ HOẠCH
Kế Hoạch Phát Triển Dự Án: Ứng Dụng Theo Dõi Tuyến Xe Buýt Giả Lập Thời Gian Thực
Tên dự án: SmartBus Tracker
Ngày lập: 20260504
Phiên bản: 1.0
Công nghệ chính: SvelteKit (Frontend) + Threlte (Three.js) + Mapbox GL JS  + Node.js/Express (Backend) + Firebase (Database & Realtime) + OpenAI API (AI)

1. Tổng Quan Dự Án
1.1. Mục Tiêu
Xây dựng ứng dụng web mô phỏng hệ thống xe buýt Cần Thơ với trải nghiệm trực quan đa chiều:
Giả lập GPS tuyến xe buýt di chuyển thời gian thực.
Hiển thị vị trí xe buýt theo thời gian thực trên bản đồ Leaflet.
Thông báo cho hành khách khi xe sắp đến trạm gần họ.
Tích hợp AI Predictor để dự báo thời gian xe đến trạm.
Tích hợp AI Assistant (chatbot) để tư vấn lộ trình.
Chuyển đổi linh hoạt 2D (topdown) ↔ 3D (perspective).
Render mô hình 3D xe buýt (glTF/GLB), các công trình/tòa nhà biểu tượng Cần Thơ dạng khối 3D.
AI Predictor + AI Assistant.
Giao diện Dark Mode Digital Twin với Glassmorphism và Neon Glow.
Sản phẩm đang trong giai đoạn thử nghiệm với mục tiêu hiện tại là 5 tuyến xe buýt tại Cần Thơ, trong tương lai sẽ mở rộng ra thêm.

1.2. Đối Tượng Người Dùng
Hành khách: Theo dõi vị trí xe buýt, nhận thông báo, hỏi đáp lộ trình.
Quản trị viên (admin): Giám sát toàn bộ hệ thống, cấu hình tuyến, trạm.

1.3. Phạm Vi MVP
Hạng mục	Trong MVP	Ngoài MVP
Giả lập 5 tuyến xe buýt	Có	
Hiển thị bản đồ realtime	Có	
Thông báo đến trạm	Có	
Hybrid View 2D ↔ 3D	Có	VR/AR mode
Mô hình 3D (Xe, Công trình)	Có	Toàn bộ thành phố
Instanced Rendering	Có	LOD (Level of Detail)
AI Predictor + Assistant	Có	Huấn luyện mô hình ML riêng (chỉ tiếng Việt/Anh)
Đăng nhập người dùng	Có (Firebase Auth)	OAuth Google/Facebook (giai đoạn 2)
Thanh toán vé	Không	Giai đoạn 3

2.Các giai đoạn phát triển
2.1.Giai đoạn 1: Khởi tạo và thiết kế (Tuần 12)
Mục tiêu: Chuẩn bị nền tảng kỹ thuật và tài liệu thiết kế.
Mã Task	Nhiệm vụ	Mô tả chi tiết	Sản phẩm bàn giao (Deliverable)
T1.1	Phân tích & Nghiên cứu	Phân tích yêu cầu người dùng và nghiên cứu tích hợp Mapbox/Threlte	Requirements
T1.2	Thiết kế hệ thống	Thiết kế kiến trúc hệ thống và luồng xử lý dữ liệu 3D (3D pipeline)	System Architecture
T1.3	Thiết kế dữ liệu	Thiết kế sơ đồ thực thể mối quan hệ (ERD)	Mermaid ERD
T1.4	Thiết kế 3D & Style	Thiết kế không gian 3D (scene) và bộ quy chuẩn phong cách	3D Rendering
T1.5	Thiết kế UI/UX	Thiết kế giao diện Dark Mode theo phong cách Digital Twin	Ui Theme + Figma files
T1.6	Khởi tạo hạ tầng	Khởi tạo repository thiết lập quy trình CI/CD và môi trường phát triển	GitHub repo + pipelines
T1.7	Cấu hình dịch vụ	Thiết lập project Firebase và khởi tạo Mapbox token	Env setup (Firebase/Mapbox)
T1.8	Chuẩn bị tài sản 3D	Tìm kiếm hoặc tạo các mô hình 3D (xe buýt định dạng .glb)	Asset pack (.glb files)
Mã Task	Nhiệm vụ	Mô tả chi tiết	Sản phẩm bàn giao (Deliverable)
Tiêu chí hoàn thành:
Toàn bộ tài liệu thiết kế được xem xét và phê duyệt.
Môi trường phát triển đã sẵn sàng với đầy đủ các token cần thiết.
Các tài sản 3D cơ bản đã được tích hợp thử nghiệm thành công.




2.2.Giai đoạn 2: Xây Dựng Backend & Cơ Sở Dữ Liệu (Tuần 34)
Mục tiêu: Xây dựng backend API và module giả lập GPS.
Task	Mô tả	Công nghệ
T2.1	Khởi tạo project Node.js (Express)	Express, TypeScript
T2.2	Thiết kế các REST API endpoints	/api/routes, /api/buses, /api/stops
T2.3	Kết nối Firebase Firestore & Realtime DB	firebaseadmin SDK
T2.4	Viết module giả lập GPS (bus simulator)	Node.js cron + setInterval
T2.5	Cấu hình WebSocket cho realtime updates	socket.io hoặc Firebase Realtime
T2.6	Unit test các API	Jest
T2.7	API endpoint trả về metadata 3D assets	CDN URL, version, LOD info
T2.8	API /api/config/3d cung cấp cấu hình scene	camera defaults, fog, bloom intensity
Tiêu chí hoàn thành: 
API chạy ổn định
Dữ liệu GPS giả lập cập nhật mỗi 2 giây. 
Hoàn thành các endpoint trả về metadata
Cấu hình 3D cho scene.

2.3.Giai đoạn 3: Xây Dựng Frontend SvelteKit (Tuần 57)
Mục tiêu: Mục tiêu: Xây dựng giao diện người dùng, tích hợp bản đồ Mapbox và hiển thị không gian 3D Digital Twin bằng Threlte.
Task	Mô tả	Công nghệ
T3.1	Khởi tạo SvelteKit project	npm create svelte@latest
T3.2	Tích hợp Mapbox GL JS với dark style	mapboxgl
T3.3	Tích hợp Threlte + Three.js	@threlte/core, @threlte/extras
T3.4	Đồng bộ camera Mapbox ↔ Three.js	Custom Mapbox layer + Three camera sync
T3.5	Load mô hình 3D xe buýt (.glb) từ CDN	GLTFLoader
T3.6	Instanced Rendering cho fleet xe buýt	InstancedMesh
T3.7	3D Buildings layer (Mapbox fillextrusion + custom glow)	Mapbox + Shader
T3.8	Interpolation GPS smooth (LERP giữa các waypoint)	Custom RAF loop
T3.9	Postprocessing: Bloom + Light Trail	postprocessing lib
T3.10	Hybrid View toggle (2D topdown ↔ 3D perspective)	Camera animation
T3.11	UI Glassmorphism panels + Chatbot widget	Tailwind + CSS filters
T3.12	Đăng nhập Firebase Auth	firebase/auth
T3.13	Responsive design + mobile gestures	Touch controls
Tiêu chí hoàn thành: 
UI hoạt động mượt mà với phong cách Glassmorphism.
Hỗ trợ chuyển đổi linh hoạt giữa chế độ xem 2D (topdown) và 3D (perspective).
Cập nhật vị trí xe buýt theo thời gian thực với hiệu ứng di chuyển mượt (Interpolation).
Giao diện tương thích tốt trên thiết bị di động (Responsive & Touch gestures).

2.4.Giai đoạn 4: Tích hợp AI (Tuần 8)
Mục tiêu: Tích hợp AI Predictor và AI Assistant.
Task	Mô tả	Công nghệ
T4.1	Thiết kế module AI Predictor (thuật toán dự báo ETA)	Python (FastAPI) hoặc Node.js
T4.2	Tích hợp dữ liệu giao thông & thời tiết giả lập	Dữ liệu JSON giả lập / OpenWeather API
T4.3	Kết nối OpenAI API cho AI Assistant	GPT4o / GPT3.5 Turbo
T4.4	Thiết kế prompt template cho chatbot	LangChain/ System Prompt Engineering
T4.5	Xây dựng UI chatbot trên frontend	Svelte component + Glassmorphism
T4.6	Test accuracy của AI Predictor	Mean Absolute Error (MAE)
Tiêu chí hoàn thành:
AI Predictor có sai số thời gian thực tế so với dự báo dưới 15%.
Chatbot (AI Assistant) phản hồi chính xác ≥ 80% các tình huống kiểm thử (về lộ trình, giá vé, hướng dẫn sử dụng).
Giao diện chatbot tích hợp mượt mà vào khung nhìn Digital Twin.

2.5.Giai đoạn 5: Kiểm Thử & Tối Ưu (Tuần 9)
Task	Mô tả	Ghi chú / Công nghệ
T5.1	Integration test toàn hệ thống	Endtoend testing
T5.2	Performance test (load 1000 concurrent users)	K6 / JMeter
T5.3	Security audit (Firebase Rules, API auth)	Security rules & JWT
T5.4	Bug fixing	Issue tracking
T5.5	Chuẩn bị tài liệu người dùng	User Manual / Video demo
T5.6	Performance test 3D — đảm bảo 60 FPS với 50 xe buýt (instanced)	Stats.js / FPS monitoring
T5.7	GPU memory profiling — tránh memory leak khi toggle view	Chrome DevTools / Memory tab
T5.8	Crossbrowser test WebGL (Chrome, Firefox, Safari, Edge)	Compatibility testing
T5.9	Mobile GPU test (giảm bloom intensity tự động trên mobile)	Autoscaling quality settings

2.6.Giai đoạn 6: Triển khai (Tuần 10)
Task	Mô tả	Môi trường / Công cụ
T6.1	Deploy frontend SvelteKit	Vercel / Firebase Hosting
T6.2	Deploy backend Node.js	Google Cloud Run / Railway
T6.3	Cấu hình domain & SSL	Cloudflare
T6.4	Monitoring & logging	Firebase Analytics, Sentry
T6.5	Upload 3D assets lên Cloudflare R2 / Firebase Storage với CDN	Cloudflare R2 / Firebase Storage
T6.6	Cấu hình CORS cho 3D asset loading	HTTP Headers / Security Rules

3.Nguồn lực & Nhân lực
Vai trò	Số lượng	Trách nhiệm chi tiết
Product Manager	1	Điều phối dự án, quản lý backlog, viết tài liệu (requirements.md), ưu tiên tính năng.
System Architect	1	Thiết kế kiến trúc hệ thống, 3D data pipeline, review code, đảm bảo tính mở rộng.
Backend Developer	1	Xây dựng Node.js API, tích hợp Firebase, module giả lập GPS, kết nối OpenAI API.
Frontend Developer	1	Phát triển giao diện SvelteKit, tích hợp Mapbox, Threlte (3D), Tailwind UI/UX.
QA Engineer	1	Lập kế hoạch kiểm thử (Integration, Performance, 3D FPS), quản lý lỗi (Bug tracking).
DevOps	1	Thiết lập CI/CD, triển khai Vercel/Cloud Run, cấu hình CDN cho 3D assets, monitoring.


4.Rủi ro & Giảm thiểu
Rủi Ro	Mức độ	Giải pháp giảm thiểu
Hiệu năng 3D kém trên thiết bị di động (Mobile)	Cao	Sử dụng Autodowngrade: Tự động tắt hiệu ứng Bloom, giảm Shadow và dùng mức độ chi tiết thấp (LOD) trên mobile.
Chi phí OpenAI API tăng cao	Cao	Cache các câu trả lời phổ biến, giới hạn số lượng token mỗi request và thiết lập hạn mức chi tiêu hàng tháng.
Đồng bộ Camera Mapbox ↔ Three.js phức tạp	Cao	Sử dụng Mapbox CustomLayerInterface theo quy chuẩn và tham chiếu các thư viện tích hợp sẵn (như @threlte/extras).
Mô hình 3D (.glb) có dung lượng quá lớn	Trung bình	Áp dụng Draco compression, Meshopt và cấu hình CDN cache để tối ưu tốc độ tải tài sản.
Rò rỉ bộ nhớ (Memory leak) khi chuyển chế độ xem	Trung bình	Thực hiện Dispose (giải phóng) tài nguyên hình học (geometry) và vật liệu (material) thủ công khi component bị hủy.
Vượt hạn mức (Quota) API Mapbox	Trung bình	Thiết lập Monitor usage, cấu hình cache tiles hợp lý và đặt soft limit để cảnh báo trước khi vượt mức.
Độ chính xác của AI Predictor thấp	Trung bình	Sử dụng thêm dữ liệu lịch sử vận hành thực tế để finetune (tinh chỉnh) lại thuật toán dự báo.
Giới hạn kết nối đồng thời của Firebase Realtime DB	Thấp	Tối ưu cấu trúc dữ liệu truyền tải và có kế hoạch chuyển đổi sang Firestore khi lượng người dùng tăng trưởng mạnh.

5.Tiêu Chí Nghiệm Thu
5 tuyến xe buýt hiển thị di chuyển mượt mà trên bản đồ.
Thông báo hiển thị khi xe cách trạm < 500m.
AI Predictor trả về ETA trong vòng 2 giây.
AI Assistant trả lời câu hỏi trong vòng 3 giây.
Hệ thống hoạt động ổn định với 100 user đồng thời.
Toggle 2D ↔ 3D mượt mà, animation < 1.5s.
Fleet 50 xe buýt chạy ≥ 60 FPS trên desktop, ≥ 30 FPS trên mobile.
Mô hình 3D xe load < 2s (với CDN cache).
Hiệu ứng Bloom + Light trail render đúng trên Chrome/Edge/Safari.
Glassmorphism UI đạt contrast AA (WCAG).
III.KIẾN TRÚC HỆ THỐNG
1.Tổng Quan Kiến Trúc
Hệ thống giữ nguyên mô hình clientserver 3 tầng của v1.0, bổ sung thêm 3D Rendering Pipeline và 3D Assets CDN để phục vụ Hybrid View.
1.1. Sơ Đồ Kiến Trúc Tổng Thể


1.2. Các Thành Phần Chính
Frontend — SvelteKit/Threlte/Mapbox
Vai trò: Giao diện người dùng, hiển thị bản đồ, chatbot, thông báo.
 Tính năng chính:
   SSR/SSG cho SEO tốt.
   Reactive UI với Svelte stores.
   Tích hợp Leaflet cho bản đồ.
   Firebase SDK để listen realtime GPS.
   Render base map (dark style), 3D Buildings layer (fillextrusion), handle pan/zoom/pitch.
   Svelte wrapper cho Three.js — quản lý 3D scene reactively
   Render mô hình xe buýt 3D, instanced rendering, custom shaders
   Cầu nối đồng bộ camera Mapbox ↔ Three.js
   Bloom, Light trail effect, FXAA
   Load mô hình .glb từ CDN

Backend — Node.js/Express
 Vai trò: REST API, xử lý nghiệp vụ, điều phối AI.
 Tính năng chính:
   API CRUD cho routes, buses, stops, users.
   Middleware xác thực JWT (Firebase token).
   WebSocket broadcast sự kiện "xe sắp đến trạm".
   Gọi AI Predictor và OpenAI API.
Bus GPS Simulator
 Vai trò: Module chạy nền giả lập chuyển động của 5 tuyến xe.
 Cơ chế:
   Mỗi xe có một mảng waypoints (danh sách tọa độ).
   Mỗi 2 giây, xe di chuyển đến waypoint tiếp theo, cập nhật Firebase Realtime DB.
   Có logic "kẹt xe" giả lập dựa trên mock traffic data.

AI Predictor
 Vai trò: Dự báo thời gian xe đến trạm (ETA).
 Đầu vào: Tọa độ xe hiện tại, tọa độ trạm đích, mật độ giao thông giả lập, thời tiết.
 Đầu ra: ETA tính bằng giây + độ tin cậy (%).

AI Assistant (OpenAI)
 Vai trò: Chatbot trả lời câu hỏi về lộ trình.
 Cơ chế: Gọi OpenAI Chat Completions API với system prompt có context về hệ thống và RAG trên dữ liệu tuyến xe.

3D Assets CDN
Lý do tách riêng: Assets tĩnh, không cần qua backend, cache edge tốt.
Nội dung: .glb xe buýt, .glb landmark Cần Thơ (Nhà Lồng Chợ, Cầu Cần Thơ…), .ktx2 textures.
Provider: Cloudflare R2 hoặc Firebase Storage với CDN.

Hybrid View Controller
Vị trí: src/lib/3d/hybridViewController.ts
Chức năng: Animate camera giữa 2 state:
2D mode: pitch=0°, bearing=0°, zoom=13
3D mode: pitch=60°, bearing=20°, zoom=15
Dùng Mapbox easeTo() để smooth transition (~1.2s).

Firebase Services
Service	Chức năng
 Firebase Auth  	Đăng nhập hành khách (email/password, Google)  
 Firestore        	Lưu routes, stops, users, chat history, predictions log 
 Realtime DB                              	Cập nhật vị trí xe buýt realtime
 Storage                        	Ảnh avatar, icons tuyến, map tiles cache 
                       


2.Luồng Dữ Liệu Cập Nhật
2.1. Luồng GPS → 3D Scene
Simulator → Firebase Realtime DB → Frontend Listener
   ↓
Svelte Store `buses` (reactive)
   ↓
Threlte InstancedMesh positions updated (perinstance matrix)
   ↓
Interpolation loop (requestAnimationFrame) → smooth LERP
   ↓
Render với Bloom postprocessing

2.2. Interpolation GPS
Mỗi bus lưu currentPosition, targetPosition, lastUpdateTime.
Mỗi frame: currentPos = lerp(currentPos, targetPos, deltaTime × factor).
Kết quả: xe di chuyển mượt giữa các tick GPS (2s) thay vì “nhảy”.

3.Cấu Trúc Thư Mục
3.1.Frontend
smartbusfrontend/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   │   ├── MapboxContainer.svelte        # Mapbox GL init
│   │   │   │   ├── ThrelteOverlay.svelte         # Three.js layer
│   │   │   │   ├── BuildingsLayer.svelte         # 3D Buildings
│   │   │   │   ├── BusFleet.svelte               # Instanced buses
│   │   │   │   ├── LightTrail.svelte             # Trail shader
│   │   │   │   ├── GridOverlay.svelte            # Grid lines (Digital Twin)
│   │   │   │   └── ViewToggle.svelte             # 2D/3D button
│   │   │   ├── 3d/
│   │   │   │   ├── BusModel.svelte               # Single bus model
│   │   │   │   ├── LandmarkBuildings.svelte
│   │   │   │   ├── PostProcessing.svelte         # Bloom, FXAA
│   │   │   │   └── Lighting.svelte
│   │   │   ├── Chat/
│   │   │   │   ├── ChatWidget.svelte             # Glassmorphism
│   │   │   │   └── ChatMessage.svelte
│   │   │   ├── Notification/
│   │   │   │   └── ArrivalToast.svelte
│   │   │   └── UI/
│   │   │       ├── GlassPanel.svelte             # Glassmorphism container
│   │   │       ├── NeonButton.svelte
│   │   │       └── Card.svelte
│   │   ├── stores/
│   │   │   ├── buses.ts
│   │   │   ├── auth.ts
│   │   │   ├── viewMode.ts                       # 2D  3D
│   │   │   └── performance.ts                    # FPS monitor
│   │   ├── 3d/
│   │   │   ├── hybridViewController.ts           # Camera 2D↔3D
│   │   │   ├── instancedBusManager.ts            # InstancedMesh logic
│   │   │   ├── gpsInterpolator.ts                # LERP GPS
│   │   │   ├── mapboxThreeSync.ts                # Mapbox CustomLayer
│   │   │   ├── modelLoader.ts                    # GLTFLoader + cache
│   │   │   ├── lightTrailShader.ts               # Custom trail shader
│   │   │   └── buildingsGlow.ts                  # Neon edges shader
│   │   ├── services/
│   │   │   ├── firebase.ts
│   │   │   ├── api.ts
│   │   │   └── assetsCDN.ts                      # 3D asset URLs
│   │   └── utils/
│   │       ├── distance.ts
│   │       ├── easing.ts
│   │       └── formatters.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte                          # Hybrid 2D/3D map
│   │   ├── login/+page.svelte
│   │   ├── routes/
│   │   │   ├── +page.svelte
│   │   │   └── [id]/+page.svelte
│   │   ├── stops/
│   │   │   └── [id]/+page.svelte
│   │   └── chat/+page.svelte
│   └── styles/
│       ├── global.css
│       ├── glassmorphism.css                     # UI styles
│       └── neon.css                              # Neon tokens
├── static/
│   └── models/                                   # (optional fallback)
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js                            # Dark theme + neon palette
└── package.json

3.2.Backend
smartbus-backend/
├── src/
│   ├── index.ts                    # Entry point
│   ├── app.ts                      # Express app config
│   ├── config/
│   │   ├── firebase.ts             # Firebase admin init
│   │   ├── openai.ts               # OpenAI client init
│   │   └── env.ts                  # Env var validation
│   │   └── threeDConfig.ts          # Camera defaults, fog, bloom
│   │   └── assetsManifest.ts         # CDN URLs version control
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── bus.routes.ts
│   │   ├── route.routes.ts         # (/api/routes — tuyến xe)
│   │   ├── stop.routes.ts
│   │   ├── prediction.routes.ts    # AI Predictor endpoints
│   │   └── chat.routes.ts          # AI Assistant endpoints
│   │   └── config.routes.ts       # /api/config/3d, /api/config/assets
│   ├── controllers/
│   │   ├── bus.controller.ts
│   │   ├── route.controller.ts
│   │   ├── stop.controller.ts
│   │   ├── prediction.controller.ts
│   │   └── chat.controller.ts
│   ├── services/
│   │   ├── bus.service.ts
│   │   ├── route.service.ts
│   │   ├── prediction.service.ts   # Logic AI Predictor
│   │   ├── chat.service.ts         # Logic gọi OpenAI
│   │   └── notification.service.ts
│   ├── simulator/
│   │   ├── busSimulator.ts         # Main simulator
│   │   ├── waypoints/              # Data waypoints của 5 tuyến
│   │   │   ├── route1.json
│   │   │   ├── route2.json
│   │   │   └── ...
│   │   └── trafficMock.ts          # Mock traffic data
│   ├── ai/
│   │   ├── predictor/
│   │   │   ├── etaCalculator.ts
│   │   │   ├── weightedModel.ts
│   │   │   └── features.ts
│   │   └── assistant/
│   │       ├── promptBuilder.ts
│   │       ├── contextRetriever.ts  # RAG
│   │       └── openaiClient.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts      # Verify Firebase JWT
│   │   ├── error.middleware.ts
│   │   └── rateLimiter.ts
│   ├── models/
│   │   ├── Bus.ts
│   │   ├── Route.ts
│   │   ├── Stop.ts
│   │   ├── User.ts
│   │   └── Prediction.ts
│   ├── utils/
│   │   ├── distance.ts
│   │   ├── logger.ts
│   │   └── errors.ts
│   └── websocket/
│       ├── socketServer.ts
│       └── events.ts
├── tests/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env


4.Sơ đồ
4.1.Sequence Diagram

Luồng GPS → Backend → AI → Frontend

Luồng GPS → AI → UI


4.2.Entity Relationship Diagram

Entity Relationship Diagram

4.3.Bảng Mapping Firebase
Collection/Path	Loại	Mục đích
users/{uid}	Firestore	Thông tin user
users/{uid}/preferences	Firestore	3D view mode, theme, perf settings
routes/{routeId}	Firestore	Metadata tuyến + neon color
buses/{busId}	Firestore	Metadata xe + modelId reference
busModels/{modelId}	Firestore	3D model config
landmarks/{landmarkId}	Firestore	3D landmarks Cần Thơ
assets3D/{assetId}	Firestore	CDN manifest (version control)
/buses/{busId}/location	Realtime DB	Vị trí live
predictions/{logId}	Firestore	Log AI
chatSessions/{sid}/messages	Firestore	Chat history

5.Bảo mật
Frontend: Chỉ lưu Firebase ID token trong httpOnly cookie.
Backend: Verify JWT qua firebase-admin trên mọi endpoint bảo mật.
Firebase Security Rules:
users/{uid}: Chỉ user đó đọc/ghi.
routes, stops: Public read, admin write.
Realtime DB /buses: Public read, chỉ backend service account ghi.
Rate limiting: 60 req/phút/user cho /api/chat
3D CDN: Signed URLs cho assets lớn (chống hotlink).
Mapbox token: Scope-restricted (chỉ cho phép domain production + dev).
CORS: Chỉ whitelist frontend domain trên CDN R2.

6.Khả Năng Mở Rộng
Horizontal scaling: Backend Node.js stateless → scale bằng Cloud Run.
Bus Simulator: Tách thành service riêng, chạy nhiều instance với Redis lock.
AI Caching: Redis cache câu hỏi chatbot phổ biến.
CDN: Cloudflare cho static assets SvelteKit.
Horizontal scaling backend: Cloud Run.
3D LOD system (giai đoạn sau): 3 mức chi tiết model tuỳ khoảng cách camera.
WebGPU (tương lai): Tăng performance rendering.
Service Worker cache: 3D assets offline-ready.

IV.TÍCH HỢP AI VÀO HỆ THỐNG SMARTBUS TRACKER
Mô tả chi tiết hai module AI: AI Predictor (dự báo ETA) và AI Assistant (chatbot RAG), cùng cách chúng tương tác với lớp hiển thị Hybrid 2D/3D.
1.Tổng Quan
Module	Mục đích	Công nghệ	Vị trí
AI Predictor	Dự báo ETA xe đến trạm	Heuristic + trọng số (v1), ML (v2)	Backend Node.js
AI Assistant	Chatbot RAG tư vấn lộ trình, hỏi-đáp 3D scene	OpenAI GPT-4o-mini + RAG	Backend Node.js

2. AI Predictor — Dự Báo Thời Gian Đến Trạm
2.1. Bài Toán
Vị trí hiện tại của xe buýt (lat_bus, lng_bus).
Vị trí trạm đích (lat_stop, lng_stop).
Mật độ giao thông giả lập trên tuyến (traffic level: low | medium | high).
Điều kiện thời tiết giả lập (clear | rain | storm).
Tốc độ trung bình của tuyến (lịch sử).
Cần tính:
ETA (thời gian đến trạm, tính bằng giây).
Confidence score (độ tin cậy 0–1).

2.2. Kiến Trúc Module
backend/src/ai/predictor/
├── features.ts         # Trích xuất đặc trưng
├── etaCalculator.ts    # Tính ETA (heuristic)
├── weightedModel.ts    # Mô hình trọng số
└── index.ts            # Public API: predictETA()

2.3. Thuật Toán (Heuristic — giai đoạn 1)
Công thức cơ bản:
baseTime = distance(bus, stop) / averageSpeed
adjustedTime = baseTime × trafficFactor × weatherFactor
confidence = 1 - (distanceFactor × 0.2 + trafficUncertainty × 0.3)


Các hệ số:
Yếu tố	Giá trị	Ảnh hưởng
trafficFactor — low	1.0	Giữ nguyên
trafficFactor — medium	1.3	+30% thời gian
trafficFactor — high	1.8	+80% thời gian
weatherFactor — clear	1.0	Giữ nguyên
weatherFactor — rain	1.15	+15%
weatherFactor — storm	1.4	+40%

Ví dụ Typescript:
// backend/src/ai/predictor/etaCalculator.ts
export interface PredictionInput {
  busLat: number;
  busLng: number;
  stopLat: number;
  stopLng: number;
  traffic: 'low' | 'medium' | 'high';
  weather: 'clear' | 'rain' | 'storm';
  avgSpeedKmh: number; // tốc độ trung bình tuyến
}

export interface PredictionOutput {
  etaSeconds: number;
  confidence: number;
  explanation: string;
}

export function predictETA(input: PredictionInput): PredictionOutput {
  const distanceKm = haversine(
    input.busLat, input.busLng,
    input.stopLat, input.stopLng
  );
  
  const baseHours = distanceKm / input.avgSpeedKmh;
  const trafficFactor = { low: 1.0, medium: 1.3, high: 1.8 }[input.traffic];
  const weatherFactor = { clear: 1.0, rain: 1.15, storm: 1.4 }[input.weather];
  const etaSeconds = baseHours * 3600 * trafficFactor * weatherFactor;
  const confidence = calculateConfidence(distanceKm, input.traffic);
  
  return {
    etaSeconds: Math.round(etaSeconds),
    confidence,
    explanation: `Dự báo dựa trên ${distanceKm.toFixed(2)}km, giao thông ${input.traffic}, thời tiết ${input.weather}`
  };
}
2.4. Kết Nối vào Hệ Thống

Luồng tích hợp

2.5. API
GET /api/predictions/eta?busId=BUS001&stopId=STOP-07

Response:
{
  "busId": "BUS001",
  "stopId": "STOP-07",
  "etaSeconds": 245,
  "etaFormatted": "4 phút 5 giây",
  "confidence": 0.82,
  "predictedAt": "2026-05-04T10:32:15Z"
}

2.6. Hiển Thị Trên UI 3D
ETA card dạng Glass Panel.
Khi ETA < 60s → pulse neon cyan xung quanh bus 3D model tương ứng.
Confidence < 0.5 → hiển thị icon warning amber.

2.7. Giai Đoạn 2 — Nâng Cấp Lên Machine Learning
Khi đã thu thập đủ prediction_logs (≥ 10k records), có thể huấn luyện mô hình:
Model: Gradient Boosting (XGBoost) hoặc LSTM cho chuỗi thời gian.
Features: distance, traffic, weather, hour of day, day of week, historical speed.
Label: actualEtaSeconds (tính sau khi xe thực sự đến trạm).
Deployment: Python FastAPI microservice, gọi từ Node.js qua REST.


3. AI Assistant — Chatbot Tư Vấn Lộ Trình
3.1. Khả Năng
Trả lời câu hỏi về lộ trình: “Từ A đến B đi tuyến nào?”
Cung cấp thông tin tuyến, trạm, giờ hoạt động.
Ước tính chi phí, thời gian di chuyển.
Xử lý ngôn ngữ tự nhiên tiếng Việt & Anh.

3.2. Kiến Trúc Module
backend/src/ai/assistant/
├── promptBuilder.ts       # Build system prompt & context
├── contextRetriever.ts    # RAG — truy xuất dữ liệu tuyến/trạm
├── openaiClient.ts        # Wrapper gọi OpenAI API
└── index.ts               # Public API: chat()
 
3.3. Mô Hình RAG (Retrieval-Augmented Generation)
Lý do dùng RAG:
OpenAI không biết dữ liệu tuyến xe của hệ thống.
Cung cấp context chính xác, giảm hallucination.
Tiết kiệm token (chỉ truyền dữ liệu liên quan).




3.4. System Prompt Template
Bạn là trợ lý AI của Smart Bus Tracker.

NHIỆM VỤ:
- Tư vấn lộ trình xe buýt dựa trên dữ liệu được cung cấp.
- Trả lời ngắn gọn, rõ ràng, thân thiện bằng tiếng Việt (trừ khi user dùng tiếng Anh).
- Nếu user yêu cầu điều hướng view 3D/2D hoặc zoom đến xe/trạm, dùng các function tools được cung cấp.
- Nếu không có thông tin trong context, trả lời "Tôi không có dữ liệu" — KHÔNG bịa.

CONTEXT HỆ THỐNG:
{{RAG_CONTEXT}}

VIEW STATE HIỆN TẠI:
- Mode: {{viewMode}}
- Camera center: {{cameraCenter}}
- Zoom: {{zoom}}

QUY TẮC:
Ưu tiên tuyến trực tiếp trước khi đề xuất trung chuyển.
Luôn nêu rõ số tuyến, tên trạm, thời gian ước tính.
Nếu user muốn xem xe cụ thể, dùng tool `focusOnBus`.
Nếu user muốn đổi view, dùng tool `switchViewMode`.
Câu trả lời ≤ 3 câu trừ khi user yêu cầu chi tiết.



VÍ DỤ CONTEXT RAG:
Khi user hỏi: “Từ Bến Thành đến Thủ Đức đi tuyến nào?”
System tự động truy xuất và chèn:
{
  "matchingRoutes": [
    {
      "routeId": "R01",
      "name": "Tuyến 01",
      "from": "Bến Thành",
      "to": "Thủ Đức",
      "totalStops": 24,
      "estimatedDuration": "45 phút",
      "frequency": "5-10 phút/chuyến"
    }
  ],
  "nearbyStops": [
    { "name": "Trạm Bến Thành", "routes": ["R01", "R02"] },
    { "name": "Trạm Thủ Đức", "routes": ["R01", "R05"] }
  ]
}

3.5. Function Tools (Tương tác 2D-3D)
// backend/src/ai/assistant/functionTools.tsexport const tools = [
  {
    type: 'function',
    function: {
      name: 'getETA',
      description: 'Lấy thời gian dự kiến xe buýt đến trạm',
      parameters: {
        type: 'object',
        properties: {
          busId: { type: 'string' },
          stopId: { type: 'string' },
        },
        required: ['busId', 'stopId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'switchViewMode',
      description: 'Chuyển đổi giữa 2D top-down và 3D perspective',
      parameters: {
        type: 'object',
        properties: {
          mode: { type: 'string', enum: ['2D', '3D'] },
        },
        required: ['mode'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'focusOnBus',
      description: 'Phóng camera đến xe buýt cụ thể (hoạt động tốt nhất ở 3D mode)',
      parameters: {
        type: 'object',
        properties: {
          busId: { type: 'string' },
          cinematicZoom: { type: 'boolean', default: true },
        },
        required: ['busId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'focusOnStop',
      description: 'Phóng camera đến trạm xe buýt',
      parameters: {
        type: 'object',
        properties: { stopId: { type: 'string' } },
        required: ['stopId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'highlightRoute',
      description: 'Tô sáng toàn bộ tuyến xe trên bản đồ với neon glow',
      parameters: {
        type: 'object',
        properties: { routeId: { type: 'string' } },
        required: ['routeId'],
      },
    },
  },
];



LUỒNG XỬ LÍ TOOL CALL:
1. User: "Cho tôi xem xe tuyến 02 ở góc 3D"
2. OpenAI phản hồi tool_calls: [
     {name: 'switchViewMode', args: {mode: '3D'}},
     {name: 'focusOnBus', args: {busId: 'BUS-R02-01'}}
   ]
3. Backend gửi xuống FE qua SSE: {type: 'tool_call', tool: ..., args: ...}
4. FE thực thi:
   - hybridViewController.switchTo3D(map)
   - camera.focusOnBusWithCinematic('BUS-R02-01')
5. Backend gửi tool_result lại OpenAI
6. OpenAI trả text: "Đã chuyển sang 3D và phóng vào xe tuyến 02."
7. FE hiển thị text trong chat (glass panel)

VÍ DỤ CONTEXT RAG:
Khi user hỏi “Từ Bến Ninh Kiều đến ĐH Cần Thơ đi tuyến nào?”
{
  "matchingRoutes": [
    {
      "routeId": "R01",
      "name": "Tuyến 01",
      "neonColor": "#00EAFF",
      "from": "Bến Ninh Kiều",
      "to": "ĐH Cần Thơ",
      "totalStops": 18,
      "estimatedDuration": "32 phút",
      "frequency": "8-12 phút/chuyến"
    }
  ],
  "nearbyLandmarks": [
    { "name": "Chợ Cần Thơ", "is3D": true, "stopId": "STOP-01" }
  ]}

3.6. API EndPoint
FUNCTION CALL THƯỜNG:
POST /api/chat
Content-Type: application/json
Authorization: Bearer <firebase-id-token>

Body:
{
  "sessionId": "sess-abc-123",
  "message": "Từ Bến Thành đến Thủ Đức đi tuyến nào?"
}

Response: (Server-Sent Events stream)
data: {"delta": "Bạn có thể "}
data: {"delta": "đi Tuyến 01"}
data: {"delta": " từ trạm Bến Thành..."}
data: {"done": true, "tokensUsed": 187}

FUNCTION CALL YÊU CẦU 3D:
POST /api/chat
Content-Type: application/json
Authorization: Bearer <firebase-id-token>

Body:
{
  "sessionId": "sess-abc-123",
  "message": "Cho tôi xem xe tuyến 02 ở góc 3D",
  "viewState": { "mode": "2D", "center": [105.78, 10.03], "zoom": 13 }
}

Response: Server-Sent Events
event: tool_call
data: {"name": "switchViewMode", "args": {"mode": "3D"}}

event: tool_call
data: {"name": "focusOnBus", "args": {"busId": "BUS-R02-01"}}

event: delta
data: {"text": "Đã chuyển sang 3D "}

event: delta
data: {"text": "và phóng vào xe tuyến 02."}

event: done
data: {"tokensUsed": 245}

CLIENT-SIDE TOOL EXCEPTION:
// src/lib/services/chatClient.tsexport function executeChatTool(tool: string, args: any, deps: {
  map: mapboxgl.Map;
  viewController: HybridViewController;
  sceneController: SceneController;
}) {
  switch (tool) {
    case 'switchViewMode':
      args.mode === '3D'
        ? deps.viewController.switchTo3D(deps.map)
        : deps.viewController.switchTo2D(deps.map);
      break;
    case 'focusOnBus':
      deps.sceneController.focusOnBus(args.busId, args.cinematicZoom);
      break;
    case 'focusOnStop':
      deps.sceneController.focusOnStop(args.stopId);
      break;
    case 'highlightRoute':
      deps.sceneController.highlightRoute(args.routeId);
      break;
  }
}


3.7. Triển Khai Kỹ Thuật
Thư viện:
openai (official SDK v4+)
firebase-admin để lưu chat history
zod để validate input
Ví dụ code:
// backend/src/ai/assistant/index.ts
import OpenAI from 'openai';
import { buildPrompt } from './promptBuilder';
import { retrieveContext } from './contextRetriever';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function* chat(userId: string, sessionId: string, message: string) {
  // 1. Retrieve context via RAG
  const context = await retrieveContext(message);
  
  // 2. Build prompt
  const messages = await buildPrompt(sessionId, message, context);
  
  // 3. Stream from OpenAI
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    stream: true,
    temperature: 0.3,
    max_tokens: 500,
  });
  
  let fullResponse = '';
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    fullResponse += delta;
    yield { delta };
  }
  
  // 4. Save to Firestore
  await saveChatMessage(sessionId, 'user', message);
  await saveChatMessage(sessionId, 'assistant', fullResponse);
}
3.8. Kiểm Soát Chi Phí Và Bảo Mật
Vấn đề	Giải pháp
Chi phí OpenAI	Dùng gpt-4o-mini (rẻ ~15× so với gpt-4), giới hạn max_tokens: 500
Lạm dụng API	Rate limit 30 requests/phút/user (Redis)
Prompt injection	Sanitize input, không cho phép override system prompt
Lộ API key	Chỉ lưu ở backend env vars, KHÔNG expose ra frontend
Cache câu hỏi phổ biến	Redis cache với TTL 1 giờ cho 100 câu hỏi top

Hiện tại có thể dùng các LLM free token để tối đa chi phí và thử nghiệm!

4. Tương Tác Giữa Hai Module AI
AI Assistant có thể gọi AI Predictor nội bộ khi user hỏi về ETA (thông qua function getETA):
User: "Xe buýt tuyến 01 sắp đến trạm Bến Thành chưa?"

Flow:
1.AI Assistant nhận diện intent = "check_eta"
→ OpenAI gọi getETA(busId, stopId)
→ Backend chạy predictETA()
2. Gọi AI Predictor → ETA = 245s
3. Tích hợp vào response: "Xe tuyến 01 sẽ đến trạm Bến Thành sau khoảng 4 phút nữa."

Cơ chế Function Calling của Open AI:
const tools = [{
  type: 'function',
  function: {
    name: 'getETA',
    description: 'Lấy thời gian dự kiến xe buýt đến trạm',
    parameters: {
      type: 'object',
      properties: {
        busId: { type: 'string' },
        stopId: { type: 'string' }
      },
      required: ['busId', 'stopId']
    }
  }
}];

// Khi OpenAI trả tool_call → backend gọi predictETA() → gửi kết quả back.


5. Monitoring & Đánh Giá
5.1. Metrics AI Predictor
Metric	Mục tiêu
MAE (Mean Absolute Error)	< 60 giây
MAPE (Mean Absolute % Error)	< 15%
Latency	< 200ms

Cách đo: So sánh predictedEtaSeconds với actualEtaSeconds (ghi nhận khi xe thực sự đến).

5.2. Metrics AI Assistant

Metric	Mục tiêu
Response relevance (human eval)	≥ 80%
Hallucination rate	< 5%
Avg tokens per request	< 600
Avg latency (first token)	< 1.5s

5.3. Dashboard
Tích hợp Firebase Analytics + custom Grafana dashboard theo dõi:
Số lượng request/ngày
Chi phí OpenAI
Accuracy predictor
User satisfaction (thumb up/down trên chatbot)

5.4. RoadMap AI
Giai đoạn	Thời điểm	Công việc
v1.0	Launch	Heuristic Predictor + GPT-4o-mini Assistant
v1.5	+3 tháng	Function calling cho 3D view control
v2.0	+6 tháng	ML Predictor (XGBoost) với dữ liệu thật
v2.5	+9 tháng	Fine-tune LLM domain giao thông VN
v3.0	+12 tháng	Predictive routing tối ưu đa mục tiêu


6. Tóm Tắt
AI Predictor: Heuristic nhanh rẻ, chạy trực tiếp Node.js.
AI Assistant: OpenAI GPT-4o-mini + RAG + Function Calling (bao gồm điều khiển view 3D).
Cả hai chạy backend, FE giao tiếp qua REST/SSE.
Tương tác thông minh: Assistant có thể tự gọi Predictor và điều khiển 3D scene.


V.UI THEME DESIGN SYSTEM

1. Triết Lý Thiết Kế
Giao diện Dark Digital Twin tái hiện cảm giác điều khiển một bản sao số của thành phố Cần Thơ — nơi dữ liệu giao thông, xe buýt, trạm chờ hiện lên như các điểm năng lượng phát sáng giữa đêm.
Nguyên tắc cốt lõi:
Tối trọng tâm, sáng điểm nhấn — Nền tối sâu, chỉ những thông tin quan trọng phát sáng.
Kính mờ phân lớp — Glassmorphism tạo cảm giác UI lơ lửng trên bản đồ.
Lưới tọa độ số — Grid overlay nhẹ gợi cảm giác không gian kỹ thuật số.
Chuyển động mượt — Micro-animations củng cố tính “live”.
Accessible dark — Đảm bảo contrast AA dù dùng nhiều glass/blur.

2. Color Palette (Design Tokens)
2.1. Base — Dark Navy

Token	Hex	HSL	Dùng cho
--bg-void	#04070D	220 52% 3%	Nền sâu nhất (map void)
--bg-base	#0A1020	224 53% 8%	Nền chính app
--bg-elevated	#121A2E	224 42% 13%	Panel, card nền
--bg-glass	rgba(18,26,46,0.55)	—	Glassmorphism panels
--bg-hover	#1A2440	225 42% 18%	Hover state

2.2. Neon Accents
Token	Hex	HSL	Dùng cho
--neon-cyan	#00EAFF	186 100% 50%	Primary accent, xe buýt tuyến 1
--neon-magenta	#FF2BD6	314 100% 58%	Tuyến 2, critical alerts
--neon-lime	#B5FF3A	77 100% 61%	Tuyến 3, success state
--neon-amber	#FFB020	38 100% 56%	Tuyến 4, warning
--neon-violet	#9D5CFF	262 100% 68%	Tuyến 5, AI Assistant
--neon-white	#E8F6FF	200 100% 95%	Text emphasis + glow

2.3. Text Colors
Token	Hex	Vai trò
--text-primary	#E8F6FF	Tiêu đề, text chính
--text-secondary	#A5B4D4	Text phụ
--text-muted	#6B7A9A	Caption, metadata
--text-disabled	#3F4B68	Disabled

2.4. Semantic Tokens
Token	Hex	Vai trò
--state-success	#3EEBAB	Success
--state-warning	#FFB020	Warning
--state-error	#FF4D6D	Error, destructive
--state-info	#00EAFF	Info


2.5. Border & Glow
Token	Value	Dùng cho
--border-subtle	rgba(255,255,255,0.08)	Viền nhẹ
--border-neon	rgba(0,234,255,0.6)	Viền glow neon
--glow-cyan	0 0 16px rgba(0,234,255,0.6)	Shadow glow
--glow-magenta	0 0 20px rgba(255,43,214,0.55)	Shadow glow magenta
--glow-lg	0 0 40px rgba(0,234,255,0.45)	Glow mạnh

2.6. Tuyến Xe Buýt → Màu Neon
Tuyến	Màu	Token
Tuyến 01	Cyan	--neon-cyan
Tuyến 02	Magenta	--neon-magenta
Tuyến 03	Lime	--neon-lime
Tuyến 04	Amber	--neon-amber
Tuyến 05	Violet	--neon-violet

3. Typography
3.1. Font Stack
Role	Font	Fallback
Display/UI	Inter	ui-sans-serif, system-ui
Serif (hiếm dùng)	Playfair Display	ui-serif, Georgia
Monospace (data, tọa độ)	JetBrains Mono	ui-monospace


3.2. Type Scale
Token	Size / Line-height	Weight	Dùng cho
text-hero	48 / 56	700	Hero titles
text-h1	32 / 40	700	Page titles
text-h2	24 / 32	600	Section
text-h3	18 / 26	600	Card title
text-body	14 / 22	400	Paragraph
text-small	12 / 18	500	Caption
text-mono	13 / 20	500	Tọa độ, ETA

3.3. Letter Spacing
Tiêu đề: -0.01em
Body: 0
Uppercase labels (Neon buttons): 0.08em

4. Spacing, Radius, Shadow
4.1. Spacing Scale (base 4px)
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96

4.2. Border Radius
Token	Value	Dùng
--radius-sm	8px	Input, chip
--radius-md	12px	Button, small card
--radius-lg	16px	Glass panel
--radius-xl	24px	Hero card, modal
--radius-full	9999px	Pill, avatar


4.3. Elevation / Shadow (Dark)
--shadow-xs: 0 1px 2px rgba(0,0,0,0.4);--shadow-sm: 0 2px 8px rgba(0,0,0,0.5);--shadow-md: 0 4px 20px rgba(0,0,0,0.55);--shadow-lg: 0 12px 40px rgba(0,0,0,0.6);--shadow-glow-cyan: 0 0 24px rgba(0,234,255,0.5);--shadow-inner-glass: inset 0 1px 0 rgba(255,255,255,0.08);



5. Glassmorphism Recipe
5.1. CSS Công Thức Chuẩn
.glass-panel {
  background: rgba(18, 26, 46, 0.55);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  box-shadow: 
    var(--shadow-md),
    var(--shadow-inner-glass);
}

5.2. Biến Thể
Biến thể	Blur	Opacity	Ứng dụng
.glass-subtle	10px	0.4	Nền nhẹ, luôn hiện
.glass-panel	18px	0.55	Side panels, chatbot
.glass-strong	28px	0.7	Modal, đối thoại
.glass-neon	18px	0.55 + border neon	CTA, notifications

5.3. Fallback
@supports not (backdrop-filter: blur(1px)) {
  .glass-panel {
    background: rgba(18, 26, 46, 0.92);
  }
}
6. Components
6.1. Neon Button
<button class="neon-btn neon-btn--cyan">Chuyển 3D</button>
.neon-btn {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-family: 'Inter';
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  box-shadow: 0 0 12px rgba(0,234,255,0.3), inset 0 0 12px rgba(0,234,255,0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}.neon-btn:hover {
  background: rgba(0,234,255,0.1);
  box-shadow: 0 0 24px rgba(0,234,255,0.6), inset 0 0 20px rgba(0,234,255,0.15);
  transform: translateY(-1px);
}

6.2. Glass Card (ETA Panel)
<div class="glass-panel eta-card">
  <div class="label">ETA TUYẾN 01</div>
  <div class="time font-mono">04:05</div>
  <div class="confidence">Độ tin cậy 82%</div>
</div>

6.3. Chatbot Widget (Glass + Neon Accent)
Container: .glass-strong + border --neon-violet
Message bubble user: --bg-elevated solid
Message bubble AI: glass nhẹ + left border glow violet
Typing indicator: 3 dots pulse neon

6.4. Bus Route Chip
.route-chip {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font: 500 12px/1 'Inter';
  background: rgba(0,234,255,0.12);
  color: var(--neon-cyan);
  border: 1px solid rgba(0,234,255,0.35);
  box-shadow: 0 0 8px rgba(0,234,255,0.3);
}

6.5. Arrival Toast Notification
[◉ pulse dot]  XE TUYẾN 01 CÒN 250M
Trạm Bến Ninh Kiều
Glass-strong background
Border-left 3px neon
Pulse dot animation
Auto-dismiss 8s hoặc swipe

7. Grid Overlay (Digital Twin Feel)
7.1. Mục Đích
Tạo cảm giác “không gian số” trên map, tương tự HUD sci-fi.

7.2. Implementation
<!-- GridOverlay.svelte -->
<div class="grid-overlay" />

<style>
.grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(0,234,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,234,255,0.05) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 85%);
  z-index: 5;
  mix-blend-mode: screen;
}
</style>
Khi ở 3D mode, grid có thể nghiêng theo perspective bằng CSS transform: perspective().

8. Motion & Micro-interactions
8.1. Easing Curves
Token	Cubic-bezier	Dùng cho
--ease-soft	cubic-bezier(0.33, 1, 0.68, 1)	UI chung
--ease-snappy	cubic-bezier(0.2, 0.9, 0.3, 1)	Button, toggle
--ease-smooth	cubic-bezier(0.65, 0, 0.35, 1)	Camera transitions

8.2. Duration
Hover: 150ms
Panel open/close: 300ms
View toggle 2D/3D: 1200ms
Toast enter: 400ms

8.3. Signature Animations
Neon Pulse: box-shadow oscillate cho critical dots.
Glow Breathing: Panel border opacity 0.4 ↔ 0.8 theo 3s loop.
Scan Line (tùy chọn): line ngang chạy qua panel khi đang load.
Typing Dots: 3 chấm neon pulse lệch pha 0.2s.

9. Accessibility
9.1. Contrast
Text chính trên --bg-base: ratio ≥ 7:1 (AAA).
Text trên glass panel: ≥ 4.5:1 (AA).
Neon accents không dùng làm text trên nền sáng — chỉ border/icon/highlight.

9.2. Reduced Motion
@media (prefers-reduced-motion: reduce) {
  .glow-breathing, .neon-pulse { animation: none; }
  .view-transition { transition-duration: 0.1s; }
}

9.3. Focus Ring
:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(0,234,255,0.2);
}

9.4. Keyboard Navigation
Tab order tuyến tính, bắt đầu từ ViewToggle → RouteList → Map → Chatbot.
Shortcut: V toggle 2D/3D, C focus chatbot, Esc đóng panel.

10. Responsive & Breakpoints
BP	Min-width	Behavior
xs	0	Chatbot full-screen drawer, panels bottom-sheet
sm	640px	Panels side drawer
md	768px	2-column (map + side)
lg	1024px	Full dashboard layout
xl	1280px	Mở rộng side panels
Mobile: auto-giảm bloom, tắt grid overlay mask blending phức tạp.



11. CSS Variable Setup (globals.css)
:root {
  /* base */
  --bg-void: #04070D;
  --bg-base: #0A1020;
  --bg-elevated: #121A2E;
  --bg-glass: rgba(18,26,46,0.55);
  
  /* neon */
  --neon-cyan: #00EAFF;
  --neon-magenta: #FF2BD6;
  --neon-lime: #B5FF3A;
  --neon-amber: #FFB020;
  --neon-violet: #9D5CFF;
  
  /* text */
  --text-primary: #E8F6FF;
  --text-secondary: #A5B4D4;
  --text-muted: #6B7A9A;
  
  /* radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* shadow */
  --shadow-md: 0 4px 20px rgba(0,0,0,0.55);
  --shadow-glow-cyan: 0 0 24px rgba(0,234,255,0.5);
  
  /* motion */
  --ease-soft: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-snappy: cubic-bezier(0.2, 0.9, 0.3, 1);
}
body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Inter', ui-sans-serif, system-ui;
}

12. Tailwind Config Extension (snippet)
// tailwind.config.jsexport default {
  theme: {
    extend: {
      colors: {
        'bg-void': 'var(--bg-void)',
        'bg-base': 'var(--bg-base)',
        'bg-elevated': 'var(--bg-elevated)',
        'neon-cyan': 'var(--neon-cyan)',
        'neon-magenta': 'var(--neon-magenta)',
        'neon-lime': 'var(--neon-lime)',
        'neon-amber': 'var(--neon-amber)',
        'neon-violet': 'var(--neon-violet)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace'],
      },
      boxShadow: {
        'glow-cyan': 'var(--shadow-glow-cyan)',
        'glow-magenta': '0 0 24px rgba(255,43,214,0.5)',
      },
      backdropBlur: {
        xs: '6px',
        glass: '18px',
      },
    }
  }
}

13. Design Mapping — UI ↔ 3D
UI Element	3D Counterpart
Route chip (cyan)	Bus model emissive cyan + trail cyan
Alert toast (magenta)	Pulse ring magenta quanh bus đang cảnh báo
Glass panel	Grid overlay cường độ thấp phía sau
Neon button hover	Camera subtly zoom in 3D scene

14. Checklist Triển Khai UI
[ ] Setup CSS variables trong global.css
[ ] Cấu hình Tailwind extension
[ ] Import Google Fonts (Inter, Playfair, JetBrains Mono)
[ ] Build GlassPanel component
[ ] Build NeonButton component
[ ] Grid overlay component
[ ] Chatbot widget glassmorphism
[ ] Arrival toast với neon pulse
[ ] Route chips cho 5 tuyến
[ ] Focus-visible styles
[ ] Reduced motion fallback
[ ] Mobile responsive kiểm thử
[ ] Contrast audit (WCAG AA)

VI.3D RENDERING PIPELINE

1.Tổng Quan Pipeline


2.Stack Công Nghệ 3D
Thư viện	Phiên bản đề xuất	Vai trò
mapbox-gl	^3.x	Base map, 3D Buildings, pitch/bearing
@threlte/core	^7.x	Svelte bindings cho Three.js
@threlte/extras	^8.x	Helpers (GLTF, HTML overlays)
three	^0.160+	Core 3D engine
postprocessing	^6.x	Bloom, FXAA, SMAA
three-stdlib	^2.x	GLTFLoader, DRACOLoader
gl-matrix	^3.x	Math helpers cho custom layer











3. Đồng Bộ Mapbox ↔ Three.js
3.1. Chiến Lược
Dùng Mapbox Custom Layer API (CustomLayerInterface) để inject Three.js vào cùng WebGL context của Mapbox. Cách này đảm bảo:
Cùng z-buffer giữa 2D tiles và 3D objects.
Camera luôn khớp nhau (không cần 2 canvas chồng nhau).
Performance tốt hơn (share GPU context).

3.2. Code Skeleton
// src/lib/3d/mapboxThreeSync.tsimport * as THREE from 'three';import type { CustomLayerInterface, Map as MapboxMap } from 'mapbox-gl';
export class ThrelteMapboxLayer implements CustomLayerInterface {
  id = 'threlte-3d-layer';
  type = 'custom' as const;
  renderingMode = '3d' as const;
  
  private camera!: THREE.Camera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private map!: MapboxMap;
  
  onAdd(map: MapboxMap, gl: WebGLRenderingContext) {
    this.map = map;
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    
    // Reuse Mapbox's WebGL context
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl as WebGL2RenderingContext,
      antialias: true,
    });
    this.renderer.autoClear = false;
  }
  
  render(gl: WebGLRenderingContext, matrix: number[]) {
    // Mapbox provides the projection matrix for current camera
    const m = new THREE.Matrix4().fromArray(matrix);
    this.camera.projectionMatrix = m;
    
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  }
  
  addObject(obj: THREE.Object3D) {
    this.scene.add(obj);
  }
}

3.3. Chuyển Đổi Tọa Độ GPS → World Space
Mapbox dùng Mercator projection. Three.js dùng unit vuông (meters). Cần convert:
import mapboxgl from 'mapbox-gl';
function lngLatToWorld(lng: number, lat: number, altitude: number = 0) {
  const mercator = mapboxgl.MercatorCoordinate.fromLngLat([lng, lat], altitude);
  return {
    x: mercator.x,
    y: mercator.y,
    z: mercator.z,
    scale: mercator.meterInMercatorCoordinateUnits(),
  };
}



Bước trung gian: Data Pre-processing Layer: Dữ liệu GPS từ Firebase sẽ đi qua bộ lọc Kalman Filter tại Client-side.  
Mục tiêu: Loại bỏ các tọa độ "rác" (noise) có sai số lớn hơn 10m hoặc các điểm tọa độ nằm ngoài hành trình dự kiến.

4. GPS Interpolation (Smooth Movement)
4.1. Vấn Đề
GPS cập nhật mỗi 2 giây → nếu chỉ setPosition(lat, lng) thì xe sẽ nhảy cục.
Cần LERP giữa lastPosition và targetPosition trong mỗi frame (~60 FPS).

4.2. Thuật Toán
// src/lib/3d/gpsInterpolator.tsinterface BusState {
  id: string;
  currentPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  lastUpdateTime: number;
  heading: number;
  targetHeading: number;
}
export class GPSInterpolator {
  private buses = new Map<string, BusState>();
  private readonly UPDATE_INTERVAL = 2000; // GPS tick (ms)
  
  updateTarget(busId: string, lat: number, lng: number, heading: number) {
    const bus = this.buses.get(busId);
    const newPos = lngLatToVector3(lng, lat);
    
    if (!bus) {
      this.buses.set(busId, {
        id: busId,
        currentPos: newPos.clone(),
        targetPos: newPos.clone(),
        lastUpdateTime: performance.now(),
        heading,
        targetHeading: heading,
      });
    } else {
      // Start new interpolation from current to new target
      bus.currentPos.copy(bus.currentPos); // keep current visual pos
      bus.targetPos.copy(newPos);
      bus.targetHeading = heading;
      bus.lastUpdateTime = performance.now();
    }
  }
  
  /** Gọi mỗi frame, trả về Map<busId, {pos, rotation}> */
  tick(now: number): Map<string, { pos: THREE.Vector3; heading: number }> {
    const result = new Map();
    for (const bus of this.buses.values()) {
      const elapsed = now - bus.lastUpdateTime;
      const t = Math.min(elapsed / this.UPDATE_INTERVAL, 1);
      
      // Easing — easeOutQuad for natural feel
      const eased = 1 - (1 - t) * (1 - t);
      
      bus.currentPos.lerpVectors(bus.currentPos, bus.targetPos, eased * 0.15);
      bus.heading = lerpAngle(bus.heading, bus.targetHeading, eased * 0.1);
      
      result.set(bus.id, {
        pos: bus.currentPos.clone(),
        heading: bus.heading,
      });
    }
    return result;
  }
}
function lerpAngle(a: number, b: number, t: number) {
  const diff = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
  return a + diff * t;
}

4.3. Tích Hợp Vào Frame Loop
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const updates = interpolator.tick(now);
  
  updates.forEach((state, busId) => {
    const idx = busIndexMap.get(busId)!;
    const matrix = new THREE.Matrix4()
      .makeRotationY(state.heading)
      .setPosition(state.pos);
    instancedBusMesh.setMatrixAt(idx, matrix);
  });
  instancedBusMesh.instanceMatrix.needsUpdate = true;
}

5. Instanced Rendering cho Fleet Xe Buýt
5.1. Lý Do
Nếu mỗi xe là 1 Mesh riêng → N draw calls → chậm với > 20 xe.
InstancedMesh chỉ 1 draw call cho toàn bộ fleet.

5.2. Setup
// src/lib/3d/instancedBusManager.tsimport * as THREE from 'three';import { GLTFLoader } from 'three-stdlib';
export class InstancedBusManager {
  private mesh!: THREE.InstancedMesh;
  private maxInstances: number;
  private busIdToIndex = new Map<string, number>();
  private freeSlots: number[] = [];
  
  constructor(maxInstances = 100) {
    this.maxInstances = maxInstances;
  }
  
  async init(gltfUrl: string) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(gltfUrl);
    
    // Merge all meshes of the bus model
    const geometry = extractGeometry(gltf.scene);
    const material = new THREE.MeshStandardMaterial({
      map: extractTexture(gltf.scene),
      emissive: new THREE.Color(0x00ffff),   // neon cyan
      emissiveIntensity: 0.6,
      metalness: 0.4,
      roughness: 0.3,
    });
    
    this.mesh = new THREE.InstancedMesh(geometry, material, this.maxInstances);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    
    // Initialize all slots as free
    for (let i = 0; i < this.maxInstances; i++) {
      this.freeSlots.push(i);
      this.mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0)); // hidden
    }
  }
  
  addBus(busId: string, initialMatrix: THREE.Matrix4): number {
    const idx = this.freeSlots.pop()!;
    this.busIdToIndex.set(busId, idx);
    this.mesh.setMatrixAt(idx, initialMatrix);
    this.mesh.instanceMatrix.needsUpdate = true;
    return idx;
  }
  
  removeBus(busId: string) {
    const idx = this.busIdToIndex.get(busId);
    if (idx === undefined) return;
    this.mesh.setMatrixAt(idx, new THREE.Matrix4().makeScale(0, 0, 0));
    this.freeSlots.push(idx);
    this.busIdToIndex.delete(busId);
  }
  
  getMesh() { return this.mesh; }
}


5.3. Per-Instance Color (Mỗi Tuyến Khác Màu)
mesh.instanceColor = new THREE.InstancedBufferAttribute(
  new Float32Array(maxInstances * 3), 3
);// Gán màu neon theo routeId:const color = new THREE.Color(0x00eaff); // neon cyan
mesh.setColorAt(idx, color);
mesh.instanceColor.needsUpdate = true;

6. 3D Buildings Layer (Mapbox + Custom Glow)
6.1. Mapbox Fill-Extrusion Base
map.addLayer({
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  type: 'fill-extrusion',
  minzoom: 13,
  paint: {
    'fill-extrusion-color': '#0a1628',
    'fill-extrusion-opacity': 0.7,
    'fill-extrusion-height': ['get', 'height'],
    'fill-extrusion-base': ['get', 'min_height'],
  }
});

6.2. Landmark Buildings (GLB) Với Neon Edges
Load landmarks.glb (Chợ Cần Thơ, Cầu Cần Thơ, …) và áp dụng shader glow edges:
// src/lib/3d/buildingsGlow.tsconst glowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    glowColor: { value: new THREE.Color(0x00ffff) },
    glowIntensity: { value: 1.2 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-viewPos.xyz);
      gl_Position = projectionMatrix * viewPos;
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    uniform float glowIntensity;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
      rim = pow(rim, 2.0) * glowIntensity;
      gl_FragColor = vec4(glowColor * rim, rim * 0.8);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
});

7. Light Trail Effect (Dải Sáng Theo Xe)
7.1. Cách Tiếp Cận
Mỗi xe lưu buffer [x, y, z, timestamp] của N vị trí gần nhất (ví dụ N=20).
Render bằng THREE.Line hoặc MeshLine với gradient opacity giảm dần theo thời gian.

7.2. Shader Trail
// Fragment shadervarying float vAge; // 0 (mới nhất) → 1 (cũ nhất)uniform vec3 trailColor;void main() {
  float alpha = pow(1.0 - vAge, 2.0);
  gl_FragColor = vec4(trailColor, alpha * 0.9);
}
Kết hợp với Bloom → tạo dải sáng neon đẹp.

8. Post-Processing: Bloom + FXAA
8.1. Setup Composer
import { EffectComposer, RenderPass, EffectPass, BloomEffect, FXAAEffect } from 'postprocessing';
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new BloomEffect({
  intensity: 1.4,
  luminanceThreshold: 0.3,
  luminanceSmoothing: 0.4,
  radius: 0.7,
});
const fxaa = new FXAAEffect();

composer.addPass(new EffectPass(camera, bloom, fxaa));
// Trong render loop:
composer.render(deltaTime);

8.2. Bloom Target — Chỉ Emissive
Dùng selection để Bloom chỉ áp dụng lên objects có emissive (xe buýt, trails, glow edges), tránh làm sáng toàn map.


8.3. Mobile Fallback
const isMobile = /Mobi|Android/i.test(navigator.userAgent);if (isMobile) {
  bloom.intensity = 0.6;
  bloom.radius = 0.4;
  // hoặc disable hoàn toàn
}

9.Hybrid View Toggle (2D ↔ 3D)
// src/lib/3d/hybridViewController.tsexport function switchTo3D(map: mapboxgl.Map) {
  map.easeTo({
    pitch: 60,
    bearing: -20,
    zoom: 15,
    duration: 1200,
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
  });
}
export function switchTo2D(map: mapboxgl.Map) {
  map.easeTo({
    pitch: 0,
    bearing: 0,
    zoom: 13,
    duration: 1200,
  });
}

TRONG SVELTE STORE:
// src/lib/stores/viewMode.ts
import { writable } from 'svelte/store';
export const viewMode = writable<'2D' | '3D'>('3D');

COMPONENT VIEWTOGGLE.SVELTE:
<script lang="ts">
  import { viewMode } from '$lib/stores/viewMode';
  import { switchTo2D, switchTo3D } from '$lib/3d/hybridViewController';
  export let map: mapboxgl.Map;
  function toggle() {
    viewMode.update(v => {
      const next = v === '2D' ? '3D' : '2D';
      next === '3D' ? switchTo3D(map) : switchTo2D(map);
      return next;
    });
  }
</script>
<button on:click={toggle} class="glass-btn neon-border">
  {$viewMode === '2D' ? 'Chuyển 3D' : 'Chuyển 2D'}
</button>
10. Asset Loading Strategy
10.1. Pipeline
Preload manifest từ /api/config/assets khi app khởi động.
Parallel fetch các .glb chính.
Draco + Meshopt compression để giảm dung lượng (70–90%).
KTX2 textures (GPU compressed, nhỏ hơn PNG 4–6×).
CDN cache với immutable header (version qua URL).

10.2. Code Skeleton
// src/lib/3d/modelLoader.tsimport { GLTFLoader, DRACOLoader, KTX2Loader } from 'three-stdlib';
const gltfLoader = new GLTFLoader();const dracoLoader = new DRACOLoader().setDecoderPath('/draco/');const ktx2Loader = new KTX2Loader().setTranscoderPath('/basis/');

gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setKTX2Loader(ktx2Loader);
const modelCache = new Map<string, Promise<GLTF>>();
export function loadModel(url: string) {
  if (!modelCache.has(url)) {
    modelCache.set(url, gltfLoader.loadAsync(url));
  }
  return modelCache.get(url)!;
}

11. Performance Targets & Monitoring
Chỉ số	Desktop	Mobile
FPS (50 buses + 3D buildings)	≥ 60	≥ 30
Initial load (3D assets)	< 3s	< 5s
Memory (heap)	< 250 MB	< 150 MB
GPU memory	< 400 MB	< 200 MB






11.1. FPS Monitor
import Stats from 'three/examples/jsm/libs/stats.module';
const stats = new Stats();document.body.appendChild(stats.dom);
// trong render loop: stats.update();

11.2. Auto-Downgrade Logic
if (avgFps < 30) {
  bloom.intensity *= 0.5;
  disableShadows();
  reduceInstances();
}
12. Checklist Triển Khai
[ ] Setup Mapbox custom layer interface
[ ] Load bus.glb với Draco compression
[ ] InstancedMesh cho max 100 buses
[ ] GPS interpolator (LERP + easing)
[ ] Light trail shader per bus
[ ] 3D Buildings Mapbox layer + custom glow shader
[ ] Post-processing: Bloom + FXAA
[ ] Hybrid View toggle (2D/3D) animation
[ ] Mobile auto-downgrade
[ ] FPS monitor + telemetry
[ ] CDN cache headers cho assets
[ ] KTX2 textures conversion
