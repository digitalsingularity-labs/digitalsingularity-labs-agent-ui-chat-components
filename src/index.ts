// Core types and interfaces
export type { Message, AgentContext } from './lib/ai-agent';

// Utility functions
export { createMessageId } from './lib/ai-agent';
export { 
  createAvatarGenerationService, 
  createMockAvatarService 
} from './lib/avatarService';

// Components
export { default as AgentChatModal } from './components/AgentChatModal';
export { default as AgentsPage } from './components/AgentsPage';
export { default as AgentsTab } from './components/AgentsTab';
export { AgentsSettings } from './components/AgentsSettings';
export { AgentFormModal } from './components/AgentFormModal';
export { AgentResponsiveLayout } from './components/AgentResponsiveLayout';
export { default as AvatarGenerator } from './components/AvatarGenerator';

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
export type { AvatarGeneratorProps } from './components/AvatarGenerator';
export type { 
  AgentManagementProps,
  AiAgent,
  AiAgentDocument
} from './lib/useAgentManagement';
export { PERSONALITY_TAGS } from './lib/useAgentManagement';

// Avatar service types
export type {
  AvatarGenerationOptions,
  AvatarGenerationResult,
  AvatarGenerationFunction
} from './lib/avatarService';

// Service interfaces (to be created)
export type {
  AgentService,
  UIComponents,
  AuthProvider,
  ToastProvider,
  AgentLibraryConfig
} from './lib/types'; 