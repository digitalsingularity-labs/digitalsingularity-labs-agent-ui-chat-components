// Core types and interfaces
export type { Message, AgentContext } from './lib/ai-agent';

// Utility functions
export { createMessageId } from './lib/ai-agent';

// Components
export { default as AgentChatModal } from './components/AgentChatModal';
export { default as AgentsPage } from './components/AgentsPage';
export { default as AgentsTab } from './components/AgentsTab';

// Export types
export type { AgentChatModalProps } from './components/AgentChatModal';
export type { AgentsPageProps } from './components/AgentsPage';
export type { 
  AgentsTabProps, 
  AiAgent as AgentsTabAiAgent
} from './components/AgentsTab';

// Service interfaces (to be created)
export type {
  AgentService,
  UIComponents,
  AuthProvider,
  ToastProvider,
  AgentLibraryConfig
} from './lib/types'; 