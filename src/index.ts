// Core types and interfaces
export type { Message, AgentContext } from './lib/ai-agent';

// Utility functions
export { createMessageId } from './lib/ai-agent';

// Components
export { default as AgentChatModal } from './components/AgentChatModal';
export { default as AgentsPage } from './components/AgentsPage';

// Service interfaces (to be created)
export type {
  AgentService,
  UIComponents,
  AuthProvider,
  ToastProvider,
  AgentLibraryConfig
} from './lib/types'; 