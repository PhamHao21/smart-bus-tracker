/**
 * buses.ts — Reactive bus state cho Svelte 5
 * ─────────────────────────────────────────────────────────────────
 * Dùng $state rune (Svelte 5) thay vì readable store Svelte 4.
 * Component import { busState } và đọc busState.data trực tiếp.
 *
 * Exported:
 *   BusData        — interface kiểu xe
 *   BusMap         — Record<busId, BusData>
 *   busState       — reactive object { data: BusMap }
 *   startListening — khởi động Firebase listener
 *   stopListening  — dọn dẹp listener
 */

import { ref, onValue, off } from 'firebase/database';
import type { DataSnapshot, Unsubscribe } from 'firebase/database';
import { db } from '$lib/services/firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BusData {
  lat:            number;
  lng:            number;
  routeId:        string;
  routeName:      string;
  color:          string;   // hex "#00EAFF"
  waypointIndex:  number;
  totalWaypoints: number;
  direction:      'forward' | 'backward';
  heading:        number;   // 0–360 độ
  updatedAt:      number;   // timestamp ms
}

export type BusMap = Record<string, BusData>;

// ─── Reactive state (Svelte 5 rune) ──────────────────────────────────────────
// Dùng object bọc ngoài để $state có thể track mutation

export const busState = $state<{ data: BusMap }>({ data: {} });

// ─── Internal ────────────────────────────────────────────────────────────────

let _unsubscribe: Unsubscribe | null = null;

// ─── Listener Management ──────────────────────────────────────────────────────

export function startListening(): void {
  if (_unsubscribe) return;

  const busesRef = ref(db, '/buses');

  const handleSnapshot = (snapshot: DataSnapshot): void => {
    if (!snapshot.exists()) {
      console.warn('[BusStore] /buses chưa có data — simulator chạy chưa?');
      busState.data = {};
      return;
    }
    busState.data = snapshot.val() as BusMap;
  };

  const handleError = (err: Error): void => {
    console.error('[BusStore] Firebase error:', err.message);
    setTimeout(() => {
      if (_unsubscribe) {
        stopListening();
        startListening();
      }
    }, 5000);
  };

  _unsubscribe = onValue(busesRef, handleSnapshot, handleError);
  console.log('[BusStore] ✅ Đang lắng nghe Firebase /buses');
}

export function stopListening(): void {
  if (_unsubscribe) {
    off(ref(db, '/buses'));
    _unsubscribe = null;
    console.log('[BusStore] 🔌 Đã ngắt Firebase listener');
  }
}