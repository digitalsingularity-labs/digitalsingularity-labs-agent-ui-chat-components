// Message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  agentId?: string; // Agent ID to track which agent sent/receives the message
}

// Context for the AI agent
export interface AgentContext {
  documentId?: number | string;
  documentTitle?: string;
  documentContent?: string;
  fields?: { fieldId: string; fieldName: string }[];
  chatHistory?: string; // Add optional chatHistory field
}

/**
 * Creates a new unique ID for messages
 */
export const createMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Utility to format timestamp to readable string
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

/**
 * Utility to create a message object
 */
export const createMessage = (
  role: Message['role'],
  content: string,
  agentId?: string
): Message => {
  return {
    id: createMessageId(),
    role,
    content,
    timestamp: Date.now(),
    agentId
  };
};

/**
 * Utility to validate message
 */
export const isValidMessage = (message: any): message is Message => {
  return (
    typeof message === 'object' &&
    typeof message.id === 'string' &&
    ['user', 'assistant', 'system'].includes(message.role) &&
    typeof message.content === 'string' &&
    typeof message.timestamp === 'number'
  );
}; 