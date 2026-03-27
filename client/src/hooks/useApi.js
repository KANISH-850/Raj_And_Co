/**
 * useApi — Generic async hook for API calls with built-in
 * loading, error, and success state management.
 *
 * Usage:
 *   const { execute, data, loading, error } = useApi(apiClient.post);
 *   const handleSubmit = () => execute('/projects', payload);
 */
import { useState, useCallback } from 'react';

const useApi = (apiFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFn(...args);
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
  }, [apiFn]);

  return { execute, data, loading, error };
};

export default useApi;
