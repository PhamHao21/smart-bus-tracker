<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>SmartBus Tracker — Cần Thơ</title>
  <meta name="description" content="Theo dõi xe buýt Cần Thơ thời gian thực. Tra cứu tuyến đường, lịch trình và vị trí xe buýt." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page">
  <!-- ── Header ── -->
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-icon">🚌</span>
        <span class="brand-name">SmartBus<span class="brand-accent">Tracker</span></span>
      </div>
      <nav class="nav">
        <a href={resolve('/tuyen-xe')} class="nav-link">Tuyến xe</a>
        <a href={resolve('/#about')} class="nav-link">Giới thiệu</a>
        <a href={resolve('/#contact')} class="nav-link">Liên hệ</a>
      </nav>
      <button class="btn-primary" onclick={() => goto(resolve('/tuyen-xe'))}>
        Tra cứu tuyến
      </button>
    </div>
  </header>

  <!-- ── Hero ── -->
  <section class="hero">
    <div class="hero-bg">
      <div class="hero-blob hero-blob-1"></div>
      <div class="hero-blob hero-blob-2"></div>
      <div class="hero-grid"></div>
    </div>
    <div class="hero-inner">
      <div class="hero-badge">
        <span class="live-dot"></span>
        Đang phát trực tiếp · Cần Thơ
      </div>
      <h1 class="hero-title">
        Theo dõi xe buýt<br />
        <span class="hero-highlight">thời gian thực</span>
      </h1>
      <p class="hero-desc">
        Tra cứu tuyến đường, xem vị trí xe buýt Cần Thơ ngay trên bản đồ.
        Nhanh chóng, chính xác, miễn phí.
      </p>
      <div class="hero-actions">
        <button class="btn-hero-primary" onclick={() => goto(resolve('/tuyen-xe'))}>
          Xem tuyến xe →
        </button>
        <a href={resolve('/#about')} class="btn-hero-secondary">Tìm hiểu thêm</a>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-num">5</span>
          <span class="stat-label">Tuyến xe</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num">5</span>
          <span class="stat-label">Xe đang chạy</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num">24/7</span>
          <span class="stat-label">Theo dõi</span>
        </div>
      </div>
    </div>

    <!-- Map preview mockup -->
    <div class="hero-map-preview">
      <div class="map-mock">
        <div class="map-mock-bar">
          <span class="map-mock-dot"></span>
          <span class="map-mock-dot"></span>
          <span class="map-mock-dot"></span>
          <span class="map-mock-title">SmartBus Map · Cần Thơ</span>
        </div>
        <div class="map-mock-body">
          <!-- Fake route lines -->
          <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" class="map-svg">
            <path d="M 200 140 Q 120 100 60 80" stroke="#00EAFF" stroke-width="2.5" fill="none" opacity="0.8" />
            <path d="M 200 140 Q 100 110 40 200" stroke="#FF00FF" stroke-width="2.5" fill="none" opacity="0.8" />
            <path d="M 200 140 Q 220 110 260 90" stroke="#00FF88" stroke-width="2.5" fill="none" opacity="0.8" />
            <path d="M 200 140 Q 170 180 130 220" stroke="#FFAA00" stroke-width="2.5" fill="none" opacity="0.8" />
            <path d="M 200 140 Q 240 170 300 190" stroke="#FF0055" stroke-width="2.5" fill="none" opacity="0.8" />
            <!-- Bus markers -->
            <circle cx="100" cy="88" r="7" fill="#00EAFF" />
            <text x="100" y="92" text-anchor="middle" font-size="8" font-weight="700" fill="#0A1020">1</text>
            <circle cx="80" cy="165" r="7" fill="#FF00FF" />
            <text x="80" y="169" text-anchor="middle" font-size="8" font-weight="700" fill="#0A1020">2</text>
            <circle cx="240" cy="96" r="7" fill="#00FF88" />
            <text x="240" y="100" text-anchor="middle" font-size="8" font-weight="700" fill="#0A1020">3</text>
            <circle cx="150" cy="195" r="7" fill="#FFAA00" />
            <text x="150" y="199" text-anchor="middle" font-size="8" font-weight="700" fill="#0A1020">4</text>
            <circle cx="270" cy="178" r="7" fill="#FF0055" />
            <text x="270" y="182" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">5</text>
            <!-- Center hub -->
            <circle cx="200" cy="140" r="6" fill="#fff" opacity="0.9" />
          </svg>
          <!-- Bus count badge -->
          <div class="map-badge">🚌 5 / 5 xe đang hoạt động</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Features ── -->
  <section class="features" id="about">
    <div class="section-inner">
      <div class="section-header">
        <span class="section-tag">Tính năng</span>
        <h2 class="section-title">Mọi thứ bạn cần để<br />di chuyển thông minh</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(0,234,255,0.12); color: #00EAFF;">📍</div>
          <h3 class="feature-title">Vị trí thời gian thực</h3>
          <p class="feature-desc">Xem chính xác vị trí từng xe buýt trên bản đồ, cập nhật mỗi 2 giây qua Firebase.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(0,255,136,0.12); color: #00FF88;">🗺️</div>
          <h3 class="feature-title">Tra cứu tuyến đường</h3>
          <p class="feature-desc">5 tuyến xe buýt Cần Thơ được hiển thị rõ ràng với thông tin lộ trình, giá vé, số trạm dừng.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(255,170,0,0.12); color: #FFAA00;">🤖</div>
          <h3 class="feature-title">Hỏi đáp AI</h3>
          <p class="feature-desc">Chatbot AI tư vấn lộ trình tốt nhất cho bạn dựa trên điểm xuất phát và điểm đến.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(255,0,85,0.12); color: #FF0055;">⚡</div>
          <h3 class="feature-title">Nhanh và nhẹ</h3>
          <p class="feature-desc">Xây dựng trên SvelteKit + Mapbox GL JS, tốc độ tải trang cực nhanh, mượt mà trên mọi thiết bị.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── CTA ── -->
  <section class="cta">
    <div class="cta-inner">
      <h2 class="cta-title">Sẵn sàng khám phá?</h2>
      <p class="cta-desc">Chọn tỉnh thành và tuyến xe để bắt đầu theo dõi ngay.</p>
      <button class="btn-cta" onclick={() => goto(resolve('/tuyen-xe'))}>
        Xem tuyến xe Cần Thơ →
      </button>
    </div>
  </section>

  <!-- ── Footer ── -->
  <footer class="footer" id="contact">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="brand-icon">🚌</span>
        <span class="brand-name">SmartBus<span class="brand-accent">Tracker</span></span>
        <p class="footer-tagline">Theo dõi xe buýt Cần Thơ thời gian thực</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <span class="footer-col-title">Sản phẩm</span>
          <a href="#tuyen-xe">Tuyến xe</a>
          <a href="#about">Giới thiệu</a>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">Liên hệ</span>
          <a href="mailto:support@smartbus.vn">support@smartbus.vn</a>
          <span class="footer-note">Dữ liệu: Vận tải Cần Thơ</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 SmartBus Tracker. MVP thử nghiệm.</span>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Be Vietnam Pro', sans-serif;
    background: var(--bg-base, #ffffff);
    color: var(--text-primary, #0F1F17);
  }

  :global(:root) {
    --green: #00A878;
    --green-dark: #007A56;
    --green-light: #E6F7F2;
    --green-glow: rgba(0, 168, 120, 0.2);
    --bg-base: #ffffff;
    --bg-surface: #f6faf8;
    --bg-dark: #0A1A14;
    --text-primary: #0F1F17;
    --text-secondary: #4A6B5C;
    --text-muted: #8AADA0;
    --border: rgba(0, 168, 120, 0.15);
  }

  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --bg-base: #0A1A14;
      --bg-surface: #0F2218;
      --text-primary: #E8F5F0;
      --text-secondary: #7AB89E;
      --text-muted: #4A7A63;
      --border: rgba(0, 168, 120, 0.2);
      --green-light: rgba(0, 168, 120, 0.12);
    }
  }

  .page {
    min-height: 100vh;
    background: var(--bg-base);
    color: var(--text-primary);
  }

  /* ── Header ── */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  @media (prefers-color-scheme: dark) {
    .header { background: rgba(10,26,20,0.88); }
  }
  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 800;
    font-size: 18px;
    text-decoration: none;
    color: var(--text-primary);
  }
  .brand-icon { font-size: 22px; }
  .brand-accent { color: var(--green); }
  .nav { display: flex; gap: 4px; margin-left: auto; }
  .nav-link {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.15s;
  }
  .nav-link:hover { background: var(--green-light); color: var(--green); }
  .btn-primary {
    padding: 8px 20px;
    background: var(--green);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-primary:hover { background: var(--green-dark); transform: translateY(-1px); }

  /* ── Hero ── */
  .hero {
    position: relative;
    min-height: 88vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 48px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 24px;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }
  .hero-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }
  .hero-blob-1 {
    width: 500px; height: 500px;
    background: var(--green-glow);
    top: -100px; right: -100px;
  }
  .hero-blob-2 {
    width: 300px; height: 300px;
    background: rgba(0,234,255,0.06);
    bottom: 0; left: -50px;
  }
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(var(--border) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.5;
  }
  .hero-inner {
    position: relative;
    z-index: 1;
  }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: var(--green-light);
    border: 1px solid rgba(0,168,120,0.3);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    color: var(--green);
    margin-bottom: 24px;
  }
  .live-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .hero-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 20px;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }
  .hero-highlight {
    color: var(--green);
    position: relative;
  }
  .hero-desc {
    font-size: 17px;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0 0 36px;
    max-width: 460px;
  }
  .hero-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 48px;
  }
  .btn-hero-primary {
    padding: 14px 28px;
    background: var(--green);
    color: white;
    border: none;
    border-radius: 12px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 20px var(--green-glow);
  }
  .btn-hero-primary:hover { background: var(--green-dark); transform: translateY(-2px); box-shadow: 0 8px 30px var(--green-glow); }
  .btn-hero-secondary {
    padding: 14px 24px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;
    border-radius: 12px;
    border: 1px solid var(--border);
    transition: all 0.2s;
  }
  .btn-hero-secondary:hover { color: var(--green); border-color: rgba(0,168,120,0.4); background: var(--green-light); }
  .hero-stats {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .stat { display: flex; flex-direction: column; gap: 2px; }
  .stat-num { font-size: 28px; font-weight: 800; color: var(--text-primary); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--text-muted); font-weight: 500; }
  .stat-divider { width: 1px; height: 36px; background: var(--border); }

  /* ── Map Preview ── */
  .hero-map-preview {
    position: relative;
    z-index: 1;
  }
  .map-mock {
    background: #0A1A14;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(0,168,120,0.3);
    box-shadow: 0 24px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,168,120,0.1);
  }
  .map-mock-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .map-mock-dot { width: 10px; height: 10px; border-radius: 50%; }
  .map-mock-dot:nth-child(1) { background: #FF5F57; }
  .map-mock-dot:nth-child(2) { background: #FFBD2E; }
  .map-mock-dot:nth-child(3) { background: #28CA41; }
  .map-mock-title { font-size: 12px; color: rgba(255,255,255,0.4); margin-left: 8px; font-family: 'JetBrains Mono', monospace; }
  .map-mock-body { position: relative; }
  .map-svg { width: 100%; display: block; background: #0D2319; }
  .map-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(10,26,20,0.9);
    border: 1px solid rgba(0,168,120,0.4);
    border-radius: 100px;
    padding: 5px 12px;
    font-size: 11px;
    color: #00A878;
    font-weight: 600;
  }

  /* ── Features ── */
  .features {
    padding: 100px 24px;
    background: var(--bg-surface);
  }
  .section-inner { max-width: 1200px; margin: 0 auto; }
  .section-header { text-align: center; margin-bottom: 60px; }
  .section-tag {
    display: inline-block;
    padding: 4px 14px;
    background: var(--green-light);
    color: var(--green);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .section-title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    line-height: 1.25;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.02em;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
  .feature-card {
    background: var(--bg-base);
    border-radius: 16px;
    padding: 28px;
    border: 1px solid var(--border);
    transition: all 0.2s;
  }
  .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,168,120,0.1); border-color: rgba(0,168,120,0.3); }
  .feature-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px; }
  .feature-title { font-size: 17px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px; }
  .feature-desc { font-size: 14px; line-height: 1.65; color: var(--text-secondary); margin: 0; }

  /* ── CTA ── */
  .cta {
    padding: 100px 24px;
    background: var(--green);
    text-align: center;
  }
  .cta-inner { max-width: 600px; margin: 0 auto; }
  .cta-title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; color: white; margin: 0 0 16px; letter-spacing: -0.02em; }
  .cta-desc { font-size: 17px; color: rgba(255,255,255,0.8); margin: 0 0 36px; }
  .btn-cta {
    padding: 16px 36px;
    background: white;
    color: var(--green);
    border: none;
    border-radius: 12px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }

  /* ── Footer ── */
  .footer { background: var(--bg-surface); border-top: 1px solid var(--border); padding: 60px 24px 0; }
  .footer-inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 60px; padding-bottom: 40px; border-bottom: 1px solid var(--border); }
  .footer-brand { flex: 1; }
  .footer-tagline { font-size: 13px; color: var(--text-muted); margin: 8px 0 0; }
  .footer-links { display: flex; gap: 48px; }
  .footer-col { display: flex; flex-direction: column; gap: 10px; }
  .footer-col-title { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .footer-col a { font-size: 14px; color: var(--text-secondary); text-decoration: none; transition: color 0.15s; }
  .footer-col a:hover { color: var(--green); }
  .footer-note { font-size: 13px; color: var(--text-muted); }
  .footer-bottom { max-width: 1200px; margin: 0 auto; padding: 20px 0; font-size: 13px; color: var(--text-muted); }

  @media (max-width: 768px) {
    .hero { grid-template-columns: 1fr; padding: 60px 16px; min-height: auto; }
    .hero-map-preview { display: none; }
    .nav { display: none; }
    .footer-inner { flex-direction: column; gap: 32px; }
    .footer-links { flex-wrap: wrap; gap: 32px; }
  }
</style>