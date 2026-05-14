<script lang="ts">
//   import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import Map2D from '$lib/components/Mapping/Map2D.svelte';
  import ChatWidget from '$lib/components/Chat/ChatWidget.svelte';

  let selectedProvince = $state<string | null>(null);
  let selectedRouteId  = $state<string | null>(null);
  let showMap          = $state(false);

  const provinces = [
    {
      id: 'can-tho',
      name: 'Cần Thơ',
      emoji: '🏙️',
      desc: '5 tuyến · Đang thử nghiệm',
      available: true,
    },
    { id: 'an-giang', name: 'An Giang', emoji: '🌾', desc: 'Sắp ra mắt', available: false },
    { id: 'kien-giang', name: 'Kiên Giang', emoji: '🌊', desc: 'Sắp ra mắt', available: false },
    { id: 'dong-thap', name: 'Đồng Tháp', emoji: '🪷', desc: 'Sắp ra mắt', available: false },
  ];

  const routes = [
    { id: 'route-1', name: 'Tuyến 1', desc: 'Bến Xe → Ô Môn', color: '#00EAFF', fare: '7.000đ', duration: '45 phút', stops: 14, distance: '25 km' },
    { id: 'route-2', name: 'Tuyến 2', desc: 'Bến Xe → Thốt Nốt', color: '#FF00FF', fare: '12.000đ', duration: '77 phút', stops: 21, distance: '49 km' },
    { id: 'route-3', name: 'Tuyến 3', desc: 'Bến Xe → ĐH Cần Thơ', color: '#00FF88', fare: '5.000đ', duration: '14 phút', stops: 10, distance: '5 km' },
    { id: 'route-4', name: 'Tuyến 4', desc: 'Bến Xe → Cái Răng', color: '#FFAA00', fare: '7.000đ', duration: '36 phút', stops: 15, distance: '19 km' },
    { id: 'route-5', name: 'Tuyến 5', desc: 'Bến Xe → Phong Điền', color: '#FF0055', fare: '9.000đ', duration: '28 phút', stops: 18, distance: '16 km' },
  ];

  const selectedRoute = $derived(routes.find(r => r.id === selectedRouteId) ?? null);

  function selectProvince(id: string) {
    selectedProvince = id;
    selectedRouteId = null;
    showMap = false;
  }

  function selectRoute(id: string) {
    selectedRouteId = id;
    showMap = true;
  }

  function backToProvinces() {
    selectedProvince = null;
    selectedRouteId = null;
    showMap = false;
  }

  function backToRoutes() {
    selectedRouteId = null;
    showMap = false;
  }
</script>

<svelte:head>
  <title>Tuyến xe — SmartBus Tracker</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page">
  <header class="header">
    <div class="header-inner">
      <a href={resolve('/')} class="brand">
        <span>🚌</span>
        <span class="brand-name">SmartBus<span class="brand-accent">Tracker</span></span>
      </a>

      <nav class="breadcrumb">
        <button class="crumb" onclick={backToProvinces}>Tuyến xe</button>
        {#if selectedProvince}
          <span class="crumb-sep">›</span>
          <button class="crumb" onclick={backToRoutes}>
            {provinces.find(p => p.id === selectedProvince)?.name}
          </button>
        {/if}
        {#if selectedRoute}
          <span class="crumb-sep">›</span>
          <span class="crumb crumb-active">{selectedRoute.name}</span>
        {/if}
      </nav>

      <div class="header-right">
        <span class="live-badge">
          <span class="live-dot"></span>
          LIVE
        </span>
      </div>
    </div>
  </header>

  <main class="main">

    {#if !selectedProvince}
      <div class="step-page">
        <div class="step-header">
          <h1 class="step-title">Chọn tỉnh thành</h1>
          <p class="step-desc">Hiện tại đang thử nghiệm tại Cần Thơ. Các tỉnh khác sắp ra mắt.</p>
        </div>
        <div class="province-grid">
          {#each provinces as prov (prov.id)}
            <button
              class="province-card"
              class:available={prov.available}
              class:unavailable={!prov.available}
              disabled={!prov.available}
              onclick={() => prov.available && selectProvince(prov.id)}
            >
              <span class="province-emoji">{prov.emoji}</span>
              <span class="province-name">{prov.name}</span>
              <span class="province-desc">{prov.desc}</span>
              {#if !prov.available}
                <span class="coming-soon">Sắp ra mắt</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

    {:else if !showMap}
      <div class="step-page">
        <div class="step-header">
          <h1 class="step-title">Tuyến xe Cần Thơ</h1>
          <p class="step-desc">Chọn một tuyến để xem bản đồ và thông tin chi tiết.</p>
        </div>
        <div class="route-list">
          {#each routes as route (route.id)}
            <button class="route-card" onclick={() => selectRoute(route.id)}>
              <div class="route-color-bar" style="background: {route.color};"></div>
              <div class="route-info">
                <div class="route-header-row">
                  <span class="route-num" style="background: {route.color}20; color: {route.color}; border: 1px solid {route.color}40;">
                    {route.name}
                  </span>
                  <span class="route-desc">{route.desc}</span>
                </div>
                <div class="route-meta">
                  <span>💰 {route.fare}</span>
                  <span>⏱️ {route.duration}</span>
                  <span>📍 {route.stops} trạm</span>
                  <span>📏 {route.distance}</span>
                </div>
              </div>
              <span class="route-arrow">→</span>
            </button>
          {/each}
        </div>
      </div>

    {:else}
      <div class="map-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <button class="back-btn" onclick={backToRoutes}>
            ← Tuyến khác
          </button>

          {#if selectedRoute}
            <div class="sidebar-route-header">
              <div class="sidebar-color-dot" style="background: {selectedRoute.color}; box-shadow: 0 0 12px {selectedRoute.color}88;"></div>
              <div>
                <div class="sidebar-route-name">{selectedRoute.name}</div>
                <div class="sidebar-route-desc">{selectedRoute.desc}</div>
              </div>
            </div>

            <div class="sidebar-stats">
              <div class="sidebar-stat">
                <span class="sidebar-stat-label">Giá vé</span>
                <span class="sidebar-stat-value">{selectedRoute.fare}</span>
              </div>
              <div class="sidebar-stat">
                <span class="sidebar-stat-label">Thời gian</span>
                <span class="sidebar-stat-value">{selectedRoute.duration}</span>
              </div>
              <div class="sidebar-stat">
                <span class="sidebar-stat-label">Số trạm</span>
                <span class="sidebar-stat-value">{selectedRoute.stops}</span>
              </div>
              <div class="sidebar-stat">
                <span class="sidebar-stat-label">Khoảng cách</span>
                <span class="sidebar-stat-value">{selectedRoute.distance}</span>
              </div>
            </div>

            <div class="sidebar-section">
              <h3 class="sidebar-section-title">Lộ trình</h3>
              <div class="route-path">
                <div class="path-point path-start">
                  <div class="path-dot start-dot"></div>
                  <span>Bến Xe Trung Tâm Cần Thơ</span>
                </div>
                <div class="path-line"></div>
                <div class="path-point path-end">
                  <div class="path-dot end-dot" style="background:{selectedRoute.color}; box-shadow: 0 0 8px {selectedRoute.color}88;"></div>
                  <span>{selectedRoute.desc.split('→')[1]?.trim()}</span>
                </div>
              </div>
            </div>

            <div class="sidebar-section">
              <h3 class="sidebar-section-title">Trạng thái xe</h3>
              <div class="bus-status">
                <div class="bus-status-icon" style="color: {selectedRoute.color};">🚌</div>
                <div>
                  <div class="bus-status-label">Đang mô phỏng</div>
                  <div class="bus-status-sub">Xe đang chạy trên tuyến · Cập nhật mỗi 2s</div>
                </div>
              </div>
            </div>
          {/if}

          <div class="sidebar-section">
            <h3 class="sidebar-section-title">Các tuyến khác</h3>
            <div class="other-routes">
              {#each routes.filter(r => r.id !== selectedRouteId) as route (route.id)}
                <button class="other-route-btn" onclick={() => selectRoute(route.id)}>
                  <span class="other-route-dot" style="background:{route.color};"></span>
                  <span>{route.name} · {route.desc.split('→')[1]?.trim()}</span>
                </button>
              {/each}
            </div>
          </div>
        </aside>

        <div class="map-area">
          <Map2D activeRouteId={selectedRouteId} />
        </div>
      </div>
    {/if}
  </main>

  {#if showMap}
    <ChatWidget />
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Be Vietnam Pro', sans-serif;
  }
  :global(:root) {
    --green: #00A878;
    --green-dark: #007A56;
    --green-light: #E6F7F2;
    --bg-base: #ffffff;
    --bg-surface: #f6faf8;
    --bg-dark: #0A1020;
    --text-primary: #0F1F17;
    --text-secondary: #4A6B5C;
    --text-muted: #8AADA0;
    --border: rgba(0,168,120,0.15);
    --sidebar-bg: #0A1020;
    --sidebar-border: rgba(255,255,255,0.07);
    --sidebar-text: #E8F6FF;
    --sidebar-muted: #5A7A9A;
  }

  .page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: var(--bg-base);
    color: var(--text-primary);
  }

  .header {
    flex-shrink: 0;
    background: rgba(10,16,32,0.96);
    border-bottom: 1px solid rgba(0,234,255,0.1);
    z-index: 100;
  }
  .header-inner {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 20px;
    height: 52px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    font-weight: 800;
    font-size: 16px;
    color: #E8F6FF;
    flex-shrink: 0;
  }
  .brand-accent { color: #00A878; }
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
  }
  .crumb {
    background: none;
    border: none;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 13px;
    color: #5A7A9A;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.15s;
  }
  .crumb:hover { color: #00A878; background: rgba(0,168,120,0.08); }
  .crumb-active { color: #E8F6FF !important; cursor: default; }
  .crumb-sep { color: #3A5A7A; font-size: 14px; }
  .header-right { margin-left: auto; }
  .live-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    background: rgba(0,168,120,0.1);
    border: 1px solid rgba(0,168,120,0.3);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #00A878;
  }
  .live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00A878;
    box-shadow: 0 0 6px #00A878;
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .main { flex: 1; overflow: hidden; position: relative; }

  .step-page {
    height: 100%;
    overflow-y: auto;
    padding: 48px 24px;
    max-width: 800px;
    margin: 0 auto;
    background: #0A1020;
  }
  .step-header { margin-bottom: 36px; }
  .step-title {
    font-size: 32px;
    font-weight: 800;
    color: #E8F6FF;
    margin: 0 0 10px;
    letter-spacing: -0.02em;
  }
  .step-desc { font-size: 15px; color: #5A7A9A; margin: 0; }

  /* Province grid */
  .province-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
  .province-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 24px 20px;
    background: #0F1E30;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    position: relative;
    font-family: 'Be Vietnam Pro', sans-serif;
  }
  .province-card.available { border-color: rgba(0,168,120,0.2); }
  .province-card.available:hover {
    border-color: rgba(0,168,120,0.5);
    background: #0F2E20;
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0,168,120,0.15);
  }
  .province-card.unavailable { opacity: 0.45; cursor: not-allowed; }
  .province-emoji { font-size: 32px; }
  .province-name { font-size: 17px; font-weight: 700; color: #E8F6FF; }
  .province-desc { font-size: 12px; color: #5A7A9A; }
  .coming-soon {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 10px;
    padding: 3px 8px;
    background: rgba(255,255,255,0.06);
    border-radius: 100px;
    color: #5A7A9A;
    font-weight: 600;
  }

  /* Route list */
  .route-list { display: flex; flex-direction: column; gap: 12px; }
  .route-card {
    display: flex;
    align-items: center;
    gap: 0;
    background: #0F1E30;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-family: 'Be Vietnam Pro', sans-serif;
    padding: 0;
  }
  .route-card:hover { border-color: rgba(255,255,255,0.15); transform: translateX(4px); background: #111E30; }
  .route-color-bar { width: 4px; height: 72px; flex-shrink: 0; }
  .route-info { flex: 1; padding: 16px 20px; }
  .route-header-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .route-num {
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }
  .route-desc { font-size: 15px; font-weight: 600; color: #E8F6FF; }
  .route-meta { display: flex; gap: 16px; flex-wrap: wrap; }
  .route-meta span { font-size: 12px; color: #5A7A9A; }
  .route-arrow { font-size: 20px; color: #3A5A7A; padding: 0 20px; transition: all 0.2s; }
  .route-card:hover .route-arrow { color: #00A878; transform: translateX(4px); }

  /* ── Map Layout ── */
  .map-layout {
    display: flex;
    height: 100%;
    overflow: hidden;
  }

  /* Sidebar */
  .sidebar {
    width: 300px;
    flex-shrink: 0;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .back-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #5A7A9A;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 13px;
    padding: 8px 14px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    margin-bottom: 20px;
  }
  .back-btn:hover { color: #E8F6FF; border-color: rgba(255,255,255,0.2); }
  .sidebar-route-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--sidebar-border);
    margin-bottom: 20px;
  }
  .sidebar-color-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
  .sidebar-route-name { font-size: 18px; font-weight: 800; color: var(--sidebar-text); }
  .sidebar-route-desc { font-size: 13px; color: var(--sidebar-muted); margin-top: 2px; }
  .sidebar-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
  .sidebar-stat {
    background: rgba(255,255,255,0.04);
    border-radius: 10px;
    padding: 12px;
  }
  .sidebar-stat-label { display: block; font-size: 11px; color: var(--sidebar-muted); margin-bottom: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .sidebar-stat-value { font-size: 15px; font-weight: 700; color: var(--sidebar-text); }
  .sidebar-section { margin-bottom: 24px; }
  .sidebar-section-title { font-size: 11px; font-weight: 700; color: var(--sidebar-muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px; }
  
  /* Route path */
  .route-path { padding-left: 4px; }
  .path-point { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--sidebar-text); }
  .path-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .start-dot { background: #E8F6FF; }
  .path-line { width: 2px; height: 24px; background: rgba(255,255,255,0.1); margin: 4px 0 4px 4px; }

  /* Bus status */
  .bus-status {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(0,168,120,0.08);
    border: 1px solid rgba(0,168,120,0.2);
    border-radius: 10px;
    padding: 12px;
  }
  .bus-status-icon { font-size: 20px; }
  .bus-status-label { font-size: 13px; font-weight: 600; color: var(--sidebar-text); }
  .bus-status-sub { font-size: 11px; color: var(--sidebar-muted); margin-top: 2px; }

  /* Other routes */
  .other-routes { display: flex; flex-direction: column; gap: 6px; }
  .other-route-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
    padding: 8px 12px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 13px;
    color: #A0B4C8;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
  }
  .other-route-btn:hover { background: rgba(255,255,255,0.07); color: #E8F6FF; }
  .other-route-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* Map area */
  .map-area { flex: 1; position: relative; overflow: hidden; }

  @media (max-width: 768px) {
    .sidebar { width: 100%; height: 280px; border-right: none; border-bottom: 1px solid var(--sidebar-border); }
    .map-layout { flex-direction: column; }
  }
</style>