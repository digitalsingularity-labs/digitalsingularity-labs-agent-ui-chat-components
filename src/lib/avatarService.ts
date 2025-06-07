/**
 * Avatar generation service for handling API calls to generate AI avatars
 */

export interface AvatarGenerationOptions {
  prompt?: string;
  agentName?: string;
  endpoint?: string;
  credentials?: RequestCredentials;
}

export interface AvatarGenerationResult {
  success: boolean;
  imageUrl: string;
  prompt?: string;
}

/**
 * Default avatar generation service that calls the standard endpoint
 */
export const createAvatarGenerationService = (baseConfig: {
  endpoint?: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
} = {}) => {
  const defaultEndpoint = baseConfig.endpoint || '/api/ai-agents/generate-avatar';
  const defaultCredentials = baseConfig.credentials || 'include';
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...baseConfig.headers
  };

  return async (prompt: string, agentName?: string): Promise<{ imageUrl: string }> => {
    const response = await fetch(defaultEndpoint, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: defaultCredentials,
      body: JSON.stringify({
        prompt,
        agentName
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate avatar: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.imageUrl) {
      throw new Error('Invalid response format from avatar generation service');
    }

    return {
      imageUrl: data.imageUrl
    };
  };
};

/**
 * Mock avatar generation service for testing/development
 */
export const createMockAvatarService = (delay: number = 2000) => {
  return async (_prompt: string, agentName?: string): Promise<{ imageUrl: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Return a placeholder image URL
    const size = 200;
    const backgroundColor = Math.floor(Math.random() * 16777215).toString(16);
    const textColor = 'ffffff';
    const text = encodeURIComponent(agentName?.substring(0, 2).toUpperCase() || 'AI');
    
    return {
      imageUrl: `https://via.placeholder.com/${size}x${size}/${backgroundColor}/${textColor}?text=${text}`
    };
  };
};

/**
 * Avatar generation service types for dependency injection
 */
export type AvatarGenerationFunction = (
  prompt: string, 
  agentName?: string
) => Promise<{ imageUrl: string }>;

export default {
  createAvatarGenerationService,
  createMockAvatarService
}; 