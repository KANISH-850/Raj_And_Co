import axios from 'axios';
import { supabase } from '../utils/supabaseClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://raj-and-co.onrender.com/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s — accounts for Render cold starts (~15-25s)
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach Supabase Bearer Token ───────
apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (!supabase) {
        console.warn('[API INTERCEPTOR] Supabase client not initialized — skipping token.');
        return config;
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.warn('[API INTERCEPTOR] Session error:', error.message);
      }

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('[API INTERCEPTOR] Token attached ✅');
      } else {
        console.warn('[API INTERCEPTOR] No active session — request will be sent without token.');
      }
    } catch (err) {
      console.error('[API INTERCEPTOR] Exception during token attachment:', err.message);
    }

    if (import.meta.env.DEV) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} → ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Normalize Errors ───────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message || 'Unknown error';

    console.error(`❌ [API ERROR] ${status || 'NETWORK'} — ${message}`);

    if (status === 401) {
      console.warn('[API] 401 Unauthorized — token may be missing or expired on server.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
