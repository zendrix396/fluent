import { useState, useEffect, useCallback } from 'react';
import { loadConfig, getBackendUrl, Config } from '../lib/config';

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [backendUrl, setBackendUrl] = useState<string>('https://fluent-bc62.onrender.com');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      const loadedConfig = await loadConfig();
      const url = await getBackendUrl();
      setConfig(loadedConfig);
      setBackendUrl(url);
      setError(null);
    } catch (err) {
      console.error('Failed to load configuration:', err);
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  return {
    config,
    backendUrl,
    loading,
    error,
    reload: loadConfiguration
  };
}
