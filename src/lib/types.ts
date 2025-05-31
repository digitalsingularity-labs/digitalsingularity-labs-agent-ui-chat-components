import { AgentContext } from './ai-agent';

// Main service interface for agent operations
export interface AgentService {
  // Chat operations
  sendMessage(
    message: string,
    context: AgentContext,
    agentId: string,
    onChunk: (chunk: string) => void,
    onError: (error: any) => void,
    onCompletion: () => void
  ): Promise<void>;
  
  // Agent operations
  getAgents(): Promise<AiAgent[]>;
  getAgent(id: string): Promise<AiAgent>;
  createAgent(agent: Omit<AiAgent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<AiAgent>;
  updateAgent(id: string, agent: Partial<AiAgent>): Promise<AiAgent>;
  deleteAgent(id: string): Promise<void>;
}

// UI components interface for dependency injection
export interface UIComponents {
  Button: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Textarea: React.ComponentType<any>;
  Avatar: React.ComponentType<any>;
  AvatarImage: React.ComponentType<any>;
  AvatarFallback: React.ComponentType<any>;
  Dialog: React.ComponentType<any>;
  DialogContent: React.ComponentType<any>;
  DialogHeader: React.ComponentType<any>;
  DialogTitle: React.ComponentType<any>;
  DialogDescription: React.ComponentType<any>;
  ScrollArea: React.ComponentType<any>;
  // Add more as needed
}

// Authentication provider interface
export interface AuthProvider {
  getToken(): Promise<string | null>;
  getCurrentUser(): Promise<any>;
}

// Toast notification interface
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export interface ToastProvider {
  toast(options: ToastOptions): void;
}

// Main configuration for the agent library
export interface AgentLibraryConfig {
  agentService: AgentService;
  uiComponents: UIComponents;
  authProvider?: AuthProvider;
  toastProvider?: ToastProvider;
}

// Agent interface (should match the one in the original project)
export interface AiAgent {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  systemInstruction: string;
  temperature: number;
  model: string;
  personalityTags: string[];
  avatarType?: 'none' | 'generated' | 'uploaded';
  avatarUrl?: string | null;
  avatarPrompt?: string | null;
  isPublic?: boolean;
  isOwner?: boolean;
  createdAt: string;
  updatedAt: string;
} 