import axios from 'axios';
import { supabase } from '../utils/supabaseClient';

/**
 * =============================================================
 * RAJ & CO — Production-Ready API Client
 * =============================================================
 * Strategy:
 * 1. Read VITE_API_BASE_URL from the deployment environment.
 * 2. Fallback to localhost during development.
 * 3. Attach Supabase JWT for relational data isolation.
 * =============================================================
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://raj-and-co.onrender.com/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Auth Injection ──────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (!supabase) return config;

      // Retrieve current session directly from Supabase Client
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn('[API] Auth interceptor failed:', err.message);
    }

    if (import.meta.env.DEV) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} → ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Error Normalization ────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.error || error.response?.data?.message;
    const message = backendMessage || error.message || 'Network connectivity issue';

    console.error(`❌ [API] ${status || 'TIMEOUT'} — ${message}`);

    // Critical: Handle session expiry
    if (status === 401 && !window.location.pathname.includes('/login')) {
      console.warn('[API] Token expired — please re-authenticate.');
      // Optional: await supabase.auth.signOut(); window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
