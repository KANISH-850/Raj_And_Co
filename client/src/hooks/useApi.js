/**
 * useApi — Generic async hook for API calls with built-in
 * loading, error, and success state management.
 *
 * Usage:
 *   const { execute, data, loading, error } = useApi(apiClient.post);
 *   const handleSubmit = () => execute('/projects', payload);
 */
import { useState, useCallback } from 'react';

const apiCache = new Map();

const useApi = (apiFn, options = {}) => {
  const { cacheKey = null, staleTime = 5 * 60 * 1000 } = options;
  
  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
        const cached = apiCache.get(cacheKey);
        if (Date.now() - cached.timestamp < staleTime) {
            return cached.data;
        }
    }
    return null;
  });
  
  // Only set initial loading state to true if we don't have cached data and plan to fetch
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    // Check cache first
    if (cacheKey) {
        const cached = apiCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < staleTime) {
            setData(cached.data);
            
            // Stale-While-Revalidate: fetch in background to update cache
            apiFn(...args).then(response => {
                apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
                setData(response.data); // Update UI with fresh data if different
            }).catch(console.error);
            
            return cached.data;
        }
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiFn(...args);
      
      if (cacheKey) {
          apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      }
      
      setData(response.data);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn, cacheKey, staleTime]);

  // Method to manually clear a specific cache key if needed (for mutations)
  const clearCache = useCallback(() => {
      if (cacheKey) apiCache.delete(cacheKey);
  }, [cacheKey]);

  return { execute, data, loading, error, clearCache };
};

export default useApi;
