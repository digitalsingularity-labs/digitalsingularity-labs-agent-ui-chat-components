// Core types and interfaces
export type { Message, AgentContext } from './lib/ai-agent';

// Utility functions
export { createMessageId } from './lib/ai-agent';

// Components
export { default as AgentChatModal } from './components/AgentChatModal';

// Service interfaces (to be created)
export type {
  AgentService,
  UIComponents,
  AuthProvider,
  ToastProvider,
  AgentLibraryConfig
} from './lib/types'; 