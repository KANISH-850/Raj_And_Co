/**
 * =============================================================
 * RAJ & CO — Centralized API Client
 * =============================================================
 * Single source of truth for all HTTP communication.
 * - Auth: Supabase session token (Bearer)
 * - Base URL: Environment-aware (local vs. production)
 * - Error: Global interceptor with user-friendly messages
 * =============================================================
 */
import axios from 'axios';
import { supabase } from '../utils/supabaseClient';

// ─── Environment-Safe Base URL ────────────────────────────────
//   LOCAL  → http://localhost:5000/api
//   PROD   → https://your-backend.onrender.com/api  (from .env)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15s — accommodates Render cold-start
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach Supabase Token ───────────────
apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (!supabase) {
        console.warn('[API] Supabase client not initialized — skipping token.');
        return config;
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.warn('[API] Could not retrieve session:', error.message);
      }

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.error('[API] Request interceptor error:', err);
    }

    if (import.meta.env.DEV) {
      console.log(`📤 [API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Global Error Handling ──────────────
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`📥 [API RESPONSE] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Unknown error';

    console.error(`🔴 [API ERROR] ${status || 'NETWORK'} — ${message}`);

    if (status === 401) {
      console.warn('[API] Unauthorized — session may have expired.');
      // To auto-logout on 401, uncomment:
      // await supabase?.auth.signOut();
      // window.location.href = '/login';
    }

    if (status === 403) {
      console.warn('[API] Forbidden — insufficient permissions.');
    }

    if (!error.response) {
      console.error('[API] Network error — backend may be sleeping (Render cold-start). Retrying is advised.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
