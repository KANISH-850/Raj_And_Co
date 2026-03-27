/**
 * api.js — Re-exports apiClient for backward compatibility.
 * Any existing file that does `import api from './services/api'`
 * will now automatically get the fixed, Supabase-powered client.
 */
export { default } from './apiClient';
