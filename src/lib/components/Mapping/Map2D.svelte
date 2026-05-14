<script lang="ts">
  import { untrack } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
  import { busState, startListening, stopListening, type BusData } from '$lib/stores/buses.svelte';
  import routesJson from '$lib/data/routes.json';
  import { SvelteMap } from 'svelte/reactivity';

  interface Props {
    activeRouteId?: string | null;
  }
  const { activeRouteId = null }: Props = $props();

  interface RouteDefinition {
    id: string;
    busId: string;
    name: string;
    shortName: string;
    color: string;
    waypoints: [number, number][];
  }

  interface MarkerState {
    marker:     mapboxgl.Marker;
    popup:      mapboxgl.Popup;
    currentLng: number;
    currentLat: number;
    targetLng:  number;
    targetLat:  number;
    busId:      string;
    data:       BusData;
  }

  const CAN_THO_CENTER: [number, number] = [105.7469, 10.0341];
  const INITIAL_ZOOM    = 12;
  const ANIMATION_FACTOR = 0.12;
  const ROUTES = (routesJson as unknown as { routes: RouteDefinition[] }).routes;


  let mapContainer = $state<HTMLDivElement | undefined>(undefined);
  let mapReady     = $state(false);

  let map: mapboxgl.Map | null = null;
  let rafId: number | null = null;
  let lastFrameTime = 0;
  let markerStates = (new SvelteMap<string, MarkerState>());

  function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - Math.min(t, 1), 3);
  }

  function createMarkerEl(color: string, shortName: string): HTMLElement {
    const el = document.createElement('div');
    el.style.cssText = 'position:relative;width:36px;height:36px;cursor:pointer;';

    const dot = document.createElement('div');
    dot.className = 'bus-dot';
    dot.style.cssText = `
      width:36px;height:36px;border-radius:50%;background:${color};
      border:2px solid rgba(255,255,255,0.8);display:flex;align-items:center;
      justify-content:center;font-family:'Be Vietnam Pro',sans-serif;font-size:10px;
      font-weight:700;color:#0A1020;letter-spacing:0.03em;
      box-shadow:0 0 12px ${color},0 0 24px ${color}55,0 2px 8px rgba(0,0,0,0.5);
      transition:transform 0.15s ease,box-shadow 0.15s ease;user-select:none;
    `;
    dot.textContent = shortName;

    const pulse = document.createElement('div');
    pulse.style.cssText = `
      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:36px;height:36px;border-radius:50%;border:2px solid ${color};
      animation:busPulse 2s ease-out infinite;pointer-events:none;opacity:0.6;
    `;

    el.appendChild(dot);
    el.appendChild(pulse);

    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'scale(1.2)';
      dot.style.boxShadow = `0 0 20px ${color},0 0 40px ${color}88,0 2px 12px rgba(0,0,0,0.6)`;
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'scale(1)';
      dot.style.boxShadow = `0 0 12px ${color},0 0 24px ${color}55,0 2px 8px rgba(0,0,0,0.5)`;
    });

    return el;
  }

  function createPopupHTML(busId: string, data: BusData): string {
    const dirIcon  = data.direction === 'forward' ? '→' : '←';
    const progress = `${data.waypointIndex + 1}/${data.totalWaypoints}`;
    const updated  = new Date(data.updatedAt).toLocaleTimeString('vi-VN');
    return `
      <div style="font-family:'Be Vietnam Pro',sans-serif;color:#E8F6FF;min-width:200px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;
                    padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1);">
          <div style="width:12px;height:12px;border-radius:50%;background:${data.color};
                      box-shadow:0 0 8px ${data.color};flex-shrink:0;"></div>
          <span style="font-weight:700;font-size:14px;">${data.routeName}</span>
        </div>
        <div style="display:grid;gap:6px;font-size:12px;color:#A5B4D4;">
          <div style="display:flex;justify-content:space-between;">
            <span>🚌 Xe</span>
            <span style="color:#E8F6FF;font-weight:600;">${busId}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>${dirIcon} Hành trình</span>
            <span style="color:#E8F6FF;">${progress}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>🧭 Hướng</span>
            <span style="color:#E8F6FF;">${data.heading.toFixed(0)}°</span>
          </div>
        </div>
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);
                    font-size:11px;color:#6B7A9A;text-align:right;">
          Cập nhật: ${updated}
        </div>
      </div>`;
  }

  function initMap(container: HTMLDivElement): void {
    mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

    map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: CAN_THO_CENTER,
      zoom: INITIAL_ZOOM,
      antialias: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: false }), 'top-right');
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      addRouteLayers();
      startListening();
      startAnimationLoop();
      mapReady = true;
    });

    map.on('error', (e: unknown) => {
      console.error('[Map2D] Mapbox error:', (e as { error?: { message?: string } }).error?.message ?? String(e));
    });
  }

  function addRouteLayers(): void {
    if (!map) return;
    ROUTES.forEach((route) => {
      const srcId   = `src-${route.id}`;
      const layerId = `layer-${route.id}`;

      map!.addSource(srcId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: route.waypoints },
        },
      });

      map!.addLayer({
        id: `${layerId}-glow`,
        type: 'line',
        source: srcId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': route.color, 'line-width': 8, 'line-opacity': 0.18, 'line-blur': 4 },
      });

      map!.addLayer({
        id: layerId,
        type: 'line',
        source: srcId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': route.color, 'line-width': 2.5, 'line-opacity': 0.8 },
      });
    });
  }

  function updateRouteVisibility(active: string | null): void {
    if (!map || !mapReady) return;
    ROUTES.forEach((route) => {
      const layerId = `layer-${route.id}`;
      const glowId  = `${layerId}-glow`;
      const isActive = !active || active === route.id;
      const opacity = isActive ? 0.8 : 0.12;
      const glowOpacity = isActive ? 0.18 : 0.04;
      const width = isActive ? (active ? 3.5 : 2.5) : 1.5;

      if (map!.getLayer(layerId)) {
        map!.setPaintProperty(layerId, 'line-opacity', opacity);
        map!.setPaintProperty(layerId, 'line-width', width);
      }
      if (map!.getLayer(glowId)) {
        map!.setPaintProperty(glowId, 'line-opacity', glowOpacity);
      }
    });
  }

  function flyToRoute(routeId: string | null): void {
    if (!map || !routeId) return;
    const route = ROUTES.find(r => r.id === routeId);
    if (!route || route.waypoints.length === 0) return;

    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    route.waypoints.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });

    map.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
      padding: { top: 60, bottom: 60, left: 60, right: 60 },
      duration: 1000,
    });
  }


  function findShortName(routeId: string): string {
    return ROUTES.find((r) => r.id === routeId)?.shortName ?? '?';
  }

  function shouldShowBus(busId: string): boolean {
    if (!activeRouteId) return true;
    const route = ROUTES.find(r => r.id === activeRouteId);
    return route?.busId === busId;
  }

  function createMarker(busId: string, data: BusData): void {
    if (!map) return;
    if (!shouldShowBus(busId)) return;

    const el    = createMarkerEl(data.color, findShortName(data.routeId));
    const popup = new mapboxgl.Popup({
      offset: 20, closeButton: true, closeOnClick: false,
      className: 'bus-popup-container', maxWidth: '280px',
    }).setHTML(createPopupHTML(busId, data));

    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([data.lng, data.lat])
      .setPopup(popup)
      .addTo(map!);

    markerStates.set(busId, {
      marker, popup,
      currentLng: data.lng, currentLat: data.lat,
      targetLng: data.lng,  targetLat: data.lat,
      busId, data,
    });
  }

  function updateMarkerTarget(busId: string, data: BusData): void {
    if (!shouldShowBus(busId)) {
      const existing = markerStates.get(busId);
      if (existing) { existing.marker.remove(); markerStates.delete(busId); }
      return;
    }

    const state = markerStates.get(busId);
    if (!state) { createMarker(busId, data); return; }

    state.targetLng = data.lng;
    state.targetLat = data.lat;
    state.data      = data;

    if (state.popup.isOpen()) {
      state.popup.setHTML(createPopupHTML(busId, data));
    }
  }

  function animationLoop(timestamp: number): void {
    const elapsed = timestamp - lastFrameTime;
    if (elapsed < 1000 / 60) {
      rafId = requestAnimationFrame(animationLoop);
      return;
    }
    lastFrameTime = timestamp;

    const t = easeOutCubic(ANIMATION_FACTOR);

    markerStates.forEach((state) => {
      const dLng  = state.targetLng - state.currentLng;
      const dLat  = state.targetLat - state.currentLat;
      const distSq = dLng * dLng + dLat * dLat;

      if (distSq < 1e-14) {
        state.currentLng = state.targetLng;
        state.currentLat = state.targetLat;
        state.marker.setLngLat([state.targetLng, state.targetLat]);
        return;
      }

      state.currentLng = lerp(state.currentLng, state.targetLng, t);
      state.currentLat = lerp(state.currentLat, state.targetLat, t);
      state.marker.setLngLat([state.currentLng, state.currentLat]);
    });

    rafId = requestAnimationFrame(animationLoop);
  }

  function startAnimationLoop(): void {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(animationLoop);
  }

  function stopAnimationLoop(): void {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  $effect(() => {
    const container = mapContainer;
    if (!container) return;

    untrack(() => initMap(container));

    return () => {
      stopAnimationLoop();
      stopListening();
      markerStates.forEach((s) => s.marker.remove());
      markerStates.clear();
      map?.remove();
      map = null;
      mapReady = false;
    };
  });

  $effect(() => {
    const buses = busState.data;
    if (!mapReady) return;

    for (const [busId, data] of Object.entries(buses)) {
      updateMarkerTarget(busId, data);
    }

    for (const busId of markerStates.keys()) {
      if (!buses[busId]) {
        markerStates.get(busId)?.marker.remove();
        markerStates.delete(busId);
      }
    }
  });

  $effect(() => {
    const active = activeRouteId;
    if (!mapReady) return;

    updateRouteVisibility(active);

    if (active) {
      flyToRoute(active);
    } else {
      map?.flyTo({ center: CAN_THO_CENTER, zoom: INITIAL_ZOOM, duration: 800 });
    }

    markerStates.forEach((s) => { s.marker.remove(); });
    markerStates.clear();
    for (const [busId, data] of Object.entries(busState.data)) {
      updateMarkerTarget(busId, data);
    }
  });

  const busCount = $derived(Object.keys(busState.data).length);
  const activeRoute = $derived(activeRouteId ? ROUTES.find(r => r.id === activeRouteId) : null);
</script>

<div class="map-wrapper">
  <div bind:this={mapContainer} class="map-container"></div>

  {#if !mapReady}
    <div class="map-loading">
      <div class="loading-spinner"></div>
      <span>Đang tải bản đồ...</span>
    </div>
  {/if}

  {#if mapReady}
    <div class="bus-count-badge">
      🚌 {activeRoute ? `${activeRoute.name}` : `${busCount} / 5 xe đang hoạt động`}
    </div>
  {/if}
</div>

<style>
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    background: #04070D;
  }

  .map-container {
    width: 100%;
    height: 100%;
  }

  .map-loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: #0A1020;
    color: #A5B4D4;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 14px;
    z-index: 10;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 168, 120, 0.2);
    border-top-color: #00A878;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .bus-count-badge {
    position: absolute;
    bottom: 40px;
    left: 12px;
    background: rgba(18, 26, 46, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 168, 120, 0.3);
    border-radius: 20px;
    padding: 6px 14px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #00A878;
    box-shadow: 0 0 12px rgba(0, 168, 120, 0.2);
    z-index: 5;
    pointer-events: none;
  }

  :global(.bus-popup-container .mapboxgl-popup-content) {
    background: rgba(12, 18, 36, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 12px !important;
    padding: 14px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
  }

  :global(.bus-popup-container .mapboxgl-popup-tip) {
    border-top-color: rgba(12, 18, 36, 0.95) !important;
    border-bottom-color: rgba(12, 18, 36, 0.95) !important;
  }

  :global(.bus-popup-container .mapboxgl-popup-close-button) {
    color: #6B7A9A !important;
    font-size: 18px !important;
  }

  :global(.bus-popup-container .mapboxgl-popup-close-button:hover) {
    color: #E8F6FF !important;
    background: transparent !important;
  }

  :global(.mapboxgl-ctrl-group) {
    background: rgba(18, 26, 46, 0.9) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }

  :global(.mapboxgl-ctrl-group button) {
    background: transparent !important;
  }

  :global(.mapboxgl-ctrl-scale) {
    background: rgba(18, 26, 46, 0.8) !important;
    border-color: rgba(0, 168, 120, 0.4) !important;
    color: #00A878 !important;
    font-size: 10px !important;
  }

  @keyframes busPulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
  }
</style>