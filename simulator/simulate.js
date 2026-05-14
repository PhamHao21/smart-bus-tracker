"use strict";

import "dotenv/config";
import admin from "firebase-admin";
import routes from "./routes.js";

import { serviceAccount } from "./serviceAccountKey.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

console.log("🚌 SmartBus Simulator khởi động...");
console.log("✅ Firebase kết nối thành công");
console.log(`🗺️  Loaded ${routes.length} tuyến xe buýt\n`);

/**
 * @typedef {{ routeId: string, busId: string, routeName: string, color: string,
 *             waypoints: [number,number][], waypointIndex: number,
 *             direction: 1|-1, totalUpdates: number }} BusState
 */

// ─── State ────────────────────────────────────────────────────────────────────

/** @type {BusState[]} */
const busStates = routes.map((route) => ({
  routeId: route.id,
  busId: route.busId,
  routeName: route.name,
  color: route.color,
  waypoints: route.waypoints,
  waypointIndex: 0,
  direction: 1,
  totalUpdates: 0,
}));

/**
 * @param {[number,number]} from
 * @param {[number,number]} to
 * @returns {number}
 */
function calcHeading(from, to) {
  const dLng = to[0] - from[0];
  const dLat = to[1] - from[1];
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  return (angle + 360) % 360;
}

/**
 * @param {BusState} state
 */
async function updateBusPosition(state) {
  const wp = state.waypoints;
  const curr = wp[state.waypointIndex];
  const nextI =
    state.direction === 1
      ? Math.min(state.waypointIndex + 1, wp.length - 1)
      : Math.max(state.waypointIndex - 1, 0);
  const next = wp[nextI];
  const heading = calcHeading(curr, next);

  /** @type {import('firebase-admin/database').Database} */
  const payload = {
    lat: curr[1],
    lng: curr[0],
    heading: Math.round(heading),
    routeId: state.routeId,
    routeName: state.routeName,
    color: state.color,
    waypointIndex: state.waypointIndex,
    totalWaypoints: wp.length,
    direction: state.direction === 1 ? "forward" : "backward",
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  };

  try {
    await db.ref(`buses/${state.busId}`).set(payload);
    state.totalUpdates++;

    if (state.totalUpdates % 5 === 1) {
      const arrow = state.direction === 1 ? "→" : "←";
      const progress = `${state.waypointIndex + 1}/${wp.length}`;
      console.log(
        `[${state.routeName.padEnd(22)}] ${state.busId}: wp ${progress} ${arrow}  ` +
          `(${curr[1].toFixed(6)}, ${curr[0].toFixed(6)})`,
      );
    }
  } catch (err) {
    console.error(`❌ ${state.busId}:`, err.message);
  }
}

// ─── Advance waypoint (ping-pong) ─────────────────────────────────────────────

/** @param {BusState} state */
function advanceWaypoint(state) {
  const nextIndex = state.waypointIndex + state.direction;

  if (nextIndex >= state.waypoints.length) {
    state.direction = -1;
    state.waypointIndex = state.waypoints.length - 2;
    console.log(`🔄 ${state.busId} đến cuối tuyến → quay đầu`);
  } else if (nextIndex < 0) {
    state.direction = 1;
    state.waypointIndex = 1;
    console.log(`🔄 ${state.busId} về bến → khởi hành lại`);
  } else {
    state.waypointIndex = nextIndex;
  }
}

// ─── Init offset (rải xe, không chồng nhau) ──────────────────────────────────

function initBusOffsets() {
  busStates.forEach((state, i) => {
    const offset = Math.floor((state.waypoints.length / 5) * i);
    state.waypointIndex = Math.min(offset, state.waypoints.length - 1);
  });

  console.log("📍 Offset ban đầu:");
  busStates.forEach((s) =>
    console.log(
      `   ${s.busId}: wp ${s.waypointIndex}/${s.waypoints.length - 1} — ${s.routeName}`,
    ),
  );
  console.log("");
}

// ─── Ghi metadata tuyến (1 lần khi khởi động) ────────────────────────────────

async function writeRoutesMetadata() {
  const routesData = {};
  routes.forEach((r) => {
    routesData[r.id] = {
      id: r.id,
      busId: r.busId,
      name: r.name,
      shortName: r.shortName,
      color: r.color,
      from: r.from,
      to: r.to,
      totalWaypoints: r.waypoints.length,
      waypoints: r.waypoints.map(([lng, lat]) => ({ lng, lat })),
    };
  });

  try {
    await db.ref("routes").set(routesData);
    console.log("📝 Đã ghi metadata 5 tuyến lên /routes\n");
  } catch (err) {
    console.error("❌ Ghi routes metadata lỗi:", err.message);
  }
}

// ─── Tick ─────────────────────────────────────────────────────────────────────

async function tick() {
  await Promise.all(
    busStates.map(async (state) => {
      await updateBusPosition(state);
      advanceWaypoint(state);
    }),
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const UPDATE_INTERVAL_MS = 2000;

async function main() {
  await writeRoutesMetadata();
  initBusOffsets();
  await tick();

  const intervalId = setInterval(async () => {
    await tick();
  }, UPDATE_INTERVAL_MS);

  console.log(
    `⏱️  Cập nhật mỗi ${UPDATE_INTERVAL_MS / 1000}s — Nhấn Ctrl+C để dừng\n`,
  );

  process.on("SIGINT", () => {
    clearInterval(intervalId);
    const total = busStates.reduce((s, b) => s + b.totalUpdates, 0);
    console.log(`\n📊 Tổng updates: ${total}`);
    busStates.forEach((s) =>
      console.log(`   ${s.busId}: ${s.totalUpdates} lần`),
    );
    console.log("\n✅ Simulator đã dừng.");
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("💥 Lỗi khởi động:", err);
  process.exit(1);
});
