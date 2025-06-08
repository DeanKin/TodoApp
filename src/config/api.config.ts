// API Configuration
export const API_CONFIG = {
    // Base URL for API endpoints
    API_URL: process.env.API_URL || 'http://localhost:3000',
    
    // You can add more API-related configuration here
    // For example:
    // API_VERSION: 'v1',
    // API_TIMEOUT: 5000,
};

// Helper function to get the full API URL for a specific endpoint
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.API_URL}${endpoint}`;
};

// Export default for convenience
export default API_CONFIG; 