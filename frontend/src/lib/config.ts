// Configuration utility for the frontend
export interface Config {
  backend: {
    baseUrl: string;
  };
}

// Load configuration from config.json
export const loadConfig = async (): Promise<Config> => {
  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading config:', error);
    // Fallback to default configuration
    return {
      backend: {
        baseUrl: 'http://localhost:8000'
      }
    };
  }
};

// Get the backend base URL
export const getBackendUrl = async (): Promise<string> => {
  const config = await loadConfig();
  return config.backend.baseUrl;
};
