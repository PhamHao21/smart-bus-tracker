/**
 * firebase.ts — Khởi tạo Firebase App và Realtime Database client
 *
 * Chỉ import những gì cần thiết (tree-shaking friendly).
 * Tất cả config đọc từ PUBLIC_ env vars → không lộ key.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_DATABASE_URL,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_APP_ID,
} from '$env/static/public';

const firebaseConfig = {
  apiKey:            PUBLIC_FIREBASE_API_KEY,
  authDomain:        PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL:       PUBLIC_FIREBASE_DATABASE_URL,
  projectId:         PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             PUBLIC_FIREBASE_APP_ID,
};

// Tránh khởi tạo lại khi HMR (Vite hot reload)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db: Database = getDatabase(app);
export { app };