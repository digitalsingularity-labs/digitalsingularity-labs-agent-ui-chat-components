// Core types and interfaces
export type { Message, AgentContext } from './lib/ai-agent';

// Utility functions
export { createMessageId } from './lib/ai-agent';

// Components
export { default as AgentChatModal } from './components/AgentChatModal';
export { default as AgentsPage } from './components/AgentsPage';
export { default as AgentsTab } from './components/AgentsTab';
export { AgentsSettings } from './components/AgentsSettings';
export { AgentFormModal } from './components/AgentFormModal';
export { AgentResponsiveLayout } from './components/AgentResponsiveLayout';

// Hooks
export { useAgentManagement } from './lib/useAgentManagement';

// Export types
export type { AgentChatModalProps } from './components/AgentChatModal';
export type { AgentsPageProps } from './components/AgentsPage';
export type { 
  AgentsTabProps, 
  AiAgent as AgentsTabAiAgent
} from './components/AgentsTab';
export type { 
  AgentsSettingsProps, 
  AgentsSettingsUIComponents 
} from './components/AgentsSettings';
export type { AgentFormModalProps } from './components/AgentFormModal';
export type { AgentResponsiveLayoutProps } from './components/AgentResponsiveLayout';
export type { 
  AgentManagementProps,
  AiAgent,
  AiAgentDocument
} from './lib/useAgentManagement';
export { PERSONALITY_TAGS } from './lib/useAgentManagement';

// Service interfaces (to be created)
export type {
  AgentService,
  UIComponents,
  AuthProvider,
  ToastProvider,
  AgentLibraryConfig
} from './lib/types'; 