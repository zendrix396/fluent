import { useState, useEffect } from 'react';
import { loadConfig, getBackendUrl, Config } from '../lib/config';

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [backendUrl, setBackendUrl] = useState<string>('http://localhost:8000');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfiguration = async () => {
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
    };

    loadConfiguration();
  }, []);

  return {
    config,
    backendUrl,
    loading,
    error,
    reload: () => {
      setLoading(true);
      loadConfiguration();
    }
  };
}
