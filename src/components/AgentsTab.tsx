import React, { useState, useEffect, useCallback, useRef } from "react";

// Import types from the existing ai-agent library
export type { Message, AgentContext } from '../lib/ai-agent';
import type { Message, AgentContext } from '../lib/ai-agent';

// Type definitions for dependency injection
export interface AiAgent {
  id: string;
  name: string;
  description?: string | null;
  systemInstruction: string;
  temperature?: number;
  model: string;
  personalityTags?: string[];
  avatarUrl?: string | null;
  avatarType?: string;
  avatarPrompt?: string;
  isPublic?: boolean;
  isOwner?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Props interface for the AgentsTab component
export interface AgentsTabProps {
  // Required props
  documentId?: number;
  documentTitle: string;
  
  // Functions
  handleSendMessage: (
    message: string,
    context: AgentContext,
    agentId: string,
    onChunk: (chunk: string) => void,
    onError: (error: Error) => void,
    onCompletion: () => void
  ) => Promise<void>;
  getDocumentContent: () => string;
  createMessageId: () => string;
  
  // API hooks and functions
  useAiAgents: () => any;
  
  // UI Components
  Textarea: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  Avatar: React.ComponentType<any>;
  AvatarFallback: React.ComponentType<any>;
  AvatarImage: React.ComponentType<any>;
  DropdownMenu: React.ComponentType<any>;
  DropdownMenuContent: React.ComponentType<any>;
  DropdownMenuItem: React.ComponentType<any>;
  DropdownMenuLabel: React.ComponentType<any>;
  DropdownMenuSeparator: React.ComponentType<any>;
  DropdownMenuTrigger: React.ComponentType<any>;
  
  // Icons
  Loader2: React.ComponentType<any>;
  Send: React.ComponentType<any>;
  Bot: React.ComponentType<any>;
  User: React.ComponentType<any>;
  Check: React.ComponentType<any>;
  Settings: React.ComponentType<any>;
  Trash: React.ComponentType<any>;
  Download: React.ComponentType<any>;
  MoreVertical: React.ComponentType<any>;
  History: React.ComponentType<any>;
  
  // Utils and services
  ReactMarkdown: React.ComponentType<any>;
  clsx: (...args: any[]) => string;
  debounce: (func: (...args: any[]) => void, delay: number) => (...args: any[]) => void;
  useToast: () => any;
  Link: React.ComponentType<any>;
}

// Define the CSS styles
const customMarkdownStyles = `
.compact-markdown-images img {
  margin-top: 0.5em !important;
  margin-bottom: 0.5em !important;
  max-width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
  display: block !important;
  border-radius: 4px;
}

.circular-avatar,
.circular-avatar > span,
.circular-avatar > span > img {
  border-radius: 9999px !important;
  overflow: hidden !important;
}

.circular-avatar {
  border: 2px solid #f5f5f5 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.circular-avatar img {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
}

.agent-avatar-selector {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.agent-avatar-selector:hover {
  transform: translateY(-2px);
}

.agent-avatar-selected {
  border: 2px solid #0070f3 !important;
  box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
}

.manage-agents-link {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 16px;
  background-color: #f5f5f5;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-left: 8px;
  white-space: nowrap;
}

.manage-agents-link:hover {
  background-color: #e5e5e5;
  color: #333;
}

.history-indicator {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #666;
  gap: 4px;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
}

.history-indicator svg {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
`;

// Add styles to document head
const addStylesToHead = () => {
  if (typeof document !== 'undefined') {
    const existingStyles = document.getElementById('agents-tab-styles');
    if (!existingStyles) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'agents-tab-styles';
      styleSheet.textContent = customMarkdownStyles;
      document.head.appendChild(styleSheet);
    }
  }
};

const AgentsTab: React.FC<AgentsTabProps> = ({
  documentId,
  documentTitle,
  handleSendMessage,
  getDocumentContent,
  createMessageId,
  useAiAgents,
  // UI Components
  Textarea,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  // Icons
  Loader2,
  Send,
  Bot,
  User,
  Check,
  Settings,
  Trash,
  Download,
  MoreVertical,
  History,
  // Utils and services
  ReactMarkdown,
  clsx,
  debounce,
  useToast,
  Link
}) => {
  // Add styles to document head
  useEffect(() => {
    addStylesToHead();
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<Message | null>(null);
  const assistantMessageRef = useRef<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [historySaved, setHistorySaved] = useState<boolean>(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState<boolean>(false);

  const { data: availableAgents, isLoading: isLoadingAgents } = useAiAgents();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { toast } = useToast();

  // Set first available agent as default
  useEffect(() => {
    if (availableAgents?.length && !selectedAgentId) {
      const defaultAgent = availableAgents[0];
      setSelectedAgentId(defaultAgent.id);
    }
  }, [availableAgents, selectedAgentId]);

  // Function to generate a storage key for this agent
  const getStorageKey = useCallback((agentId: string, secondaryAgentId?: string) => {
    // If we have both agent IDs, it's a group chat
    if (secondaryAgentId) {
      return `agent_chat_history_${agentId}_${secondaryAgentId}_doc_${documentId || 'none'}`;
    }
    // Regular single-agent chat
    return `agent_chat_history_${agentId}_doc_${documentId || 'none'}`;
  }, [documentId]);

  // Function to save conversation to localStorage
  const saveConversation = useCallback(() => {
    if (!selectedAgentId || messages.length === 0) return;
    
    try {
      const storageKey = getStorageKey(selectedAgentId);
      localStorage.setItem(storageKey, JSON.stringify(messages));
      
      // Show saved indicator
      setHistorySaved(true);
      setShowSavedIndicator(true);
      setTimeout(() => setShowSavedIndicator(false), 2000);
    } catch (error) {
      // Handle error silently for production
    }
  }, [selectedAgentId, messages, getStorageKey]);

  // Function to load conversation from localStorage
  const loadConversation = useCallback(() => {
    if (!selectedAgentId) return;
    
    try {
      const storageKey = getStorageKey(selectedAgentId);
      const savedChat = localStorage.getItem(storageKey);
      
      if (savedChat) {
        const savedMessages = JSON.parse(savedChat) as Message[];
        // Filter out any invalid messages
        const validMessages = savedMessages.filter(msg => 
          msg && 
          typeof msg.id === 'string' && 
          typeof msg.role === 'string' && 
          typeof msg.content === 'string' &&
          typeof msg.timestamp === 'number'
        );
        setSafeMessages(validMessages);
        setHistorySaved(true);
      } else {
        setHistorySaved(false);
      }
    } catch (error) {
      // If there's an error parsing, clear the corrupted data
      if (selectedAgentId) {
        localStorage.removeItem(getStorageKey(selectedAgentId));
      }
      setHistorySaved(false);
    }
  }, [selectedAgentId, getStorageKey]);

  // Function to clear conversation history
  const clearConversation = useCallback(() => {
    if (!selectedAgentId) return;

    try {
      const storageKey = getStorageKey(selectedAgentId);
      localStorage.removeItem(storageKey);
      
      // Reset messages to just a greeting
      const agentName = availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.name || "Agent";
      const greetingMessage: Message = {
          id: createMessageId(),
          role: "assistant",
          content: `Bună! Sunt ${agentName}. Cum te pot ajuta cu documentul "${documentTitle}"?`,
          timestamp: Date.now(),
          agentId: selectedAgentId
      };
      
      // Only add the greeting message if it's valid
      if (greetingMessage.id && greetingMessage.role && greetingMessage.content) {
        setSafeMessages([greetingMessage]);
      } else {
        setSafeMessages([]);
      }
      setHistorySaved(false);
      
      toast({
        title: "Istoric șters",
        description: "Conversația a fost ștearsă cu succes.",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge conversația.",
        variant: "destructive",
      });
    }
  }, [selectedAgentId, getStorageKey, availableAgents, documentTitle, toast, createMessageId]);

  // Function to export conversation
  const exportConversation = useCallback(() => {
    if (!selectedAgentId || messages.length === 0) return;
    
    try {
      const agentName = availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.name || 'agent';
      const filename = `conversatie_${agentName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      
      // Format the conversation for export
      const exportData = {
        agent: agentName,
        document: documentTitle,
        timestamp: new Date().toISOString(),
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp).toISOString(),
          from: m.role === 'assistant' && m.agentId 
            ? availableAgents?.find((a: AiAgent) => a.id === m.agentId)?.name || 'assistant'
            : m.role
        }))
      };
      
      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Conversație exportată",
        description: "Conversația a fost exportată cu succes.",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut exporta conversația.",
        variant: "destructive",
      });
    }
  }, [selectedAgentId, messages, availableAgents, documentTitle, toast]);

  const debouncedScrollToBottom = useCallback(
    debounce(() => {
      requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          const container = messagesContainerRef.current;
          if (container) {
              const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
              if (isScrolledToBottom) {
                 messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
              }
          }
        }
      });
    }, 100),
    [debounce]
  );

  const immediateScrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
      }
    });
  }, []);

  useEffect(() => {
    debouncedScrollToBottom();
  }, [messages, debouncedScrollToBottom]);

  useEffect(() => {
    if (currentAssistantMessage?.content) {
      debouncedScrollToBottom();
    }
  }, [currentAssistantMessage?.content, debouncedScrollToBottom]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      // Check for null messages and clean up if found
      const nullMessages = messages.filter(msg => !msg || !msg.id || !msg.role);
      if (nullMessages.length > 0) {
        // Clean up invalid messages
        const validMessages = messages.filter(msg => msg && msg.id && msg.role && typeof msg.content === 'string');
        if (validMessages.length !== messages.length) {
          setSafeMessages(validMessages);
          return;
        }
      }
      
      saveConversation();
    }
  }, [messages, isLoading, saveConversation]);

  // Load conversation when opening with a new agent
  useEffect(() => {
    if (selectedAgentId) {
      // Only load saved messages if we don't already have an ongoing conversation
      if (messages.length === 0) {
        loadConversation();
      }
    }
  }, [selectedAgentId, loadConversation, messages.length]);

  useEffect(() => {
    if (messages.length === 0 && selectedAgentId) {
        const agentName = availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.name || "Agent";
        const greetingMessage: Message = {
            id: createMessageId(),
            role: "assistant",
            content: `Bună! Sunt ${agentName}. Cum te pot ajuta cu documentul "${documentTitle}"?`,
            timestamp: Date.now(),
            agentId: selectedAgentId
        };
        
        // Only add the greeting message if it's valid
        if (greetingMessage.id && greetingMessage.role && greetingMessage.content) {
          setSafeMessages([greetingMessage]);
        }
    }
  }, [selectedAgentId, availableAgents, documentTitle, messages.length, createMessageId]);

  // Handle change of agent
  const handleAgentChange = (newAgentId: string) => {
    if (newAgentId === selectedAgentId) return;
    
    const previousAgentId = selectedAgentId;
    setSelectedAgentId(newAgentId);
    
    // Get the target agent info
    const targetAgent = availableAgents?.find((a: AiAgent) => a.id === newAgentId);
    
    if (!targetAgent) return;
    
    // If switching from one agent to another and there are messages, create a group chat
    if (previousAgentId && messages.length > 0) {
      // Create a transition message
      const transitionMessage: Message = {
        id: createMessageId(),
        role: "assistant",
        content: `*${targetAgent.name} s-a alăturat conversației și va continua să răspundă.*`,
        timestamp: Date.now(),
        agentId: targetAgent.id
      };
      
      // Add the transition message to the existing conversation (with safety check)
      if (transitionMessage.id && transitionMessage.role && transitionMessage.content) {
        setSafeMessages(prev => [...prev, transitionMessage]);
      }
    } else {
      // If starting fresh or there are no messages, reset messages
      setSafeMessages([]);
    }
  };

  const handleLocalSendMessage = async () => {
    if (!selectedAgentId) {
      toast({
        title: "Atenție",
        description: "Vă rugăm să selectați un agent.",
        variant: "destructive",
      });
      return;
    }
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    setInput("");
    setIsLoading(true);

    const userMessage: Message = {
      id: createMessageId(),
      role: "user",
      content: trimmedInput,
      timestamp: Date.now(),
    };
    
    // Only add user message if it's valid
    if (userMessage.id && userMessage.role && userMessage.content) {
      setSafeMessages(prev => [...prev, userMessage]);
      immediateScrollToBottom();
    }

    const assistantMessage: Message = {
      id: createMessageId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      agentId: selectedAgentId // Add the current agent ID to the message
    };
    
    setCurrentAssistantMessage(assistantMessage);
    assistantMessageRef.current = assistantMessage;

    // Make sure to get the current document content at the time of sending
    const documentContent = getDocumentContent();

    // Format the chat history to include in the request
    // Skip the initial greeting message and format for the AI
    const chatHistory = messages.length > 1 
      ? messages.slice(1).map(msg => {
          const sender = msg.role === 'assistant' && msg.agentId
            ? availableAgents?.find((a: AiAgent) => a.id === msg.agentId)?.name || 'AI'
            : msg.role === 'user' ? 'User' : 'AI';
          
          // Skip transition messages
          if (msg.role === 'assistant' && msg.content.includes('s-a alăturat conversației')) {
            return null;
          }
          
          return `${sender}: ${msg.content}`;
        }).filter(Boolean).join('\n\n')
      : '';

    const context: AgentContext = {
      documentId: documentId,
      documentTitle: documentTitle,
      documentContent: documentContent, // Pass the current document content
      fields: [],
      chatHistory: chatHistory, // Add chat history to context
    };

    // If there's chat history, we'll include it in the message as well for systems that don't use context
    const messageWithHistory = chatHistory 
      ? `${chatHistory}\n\nUser: ${trimmedInput}`
      : trimmedInput;

    await handleSendMessage(
      messageWithHistory,
      context,
      selectedAgentId,
      (chunk) => {
        setCurrentAssistantMessage(prev => {
          if (!prev) {
            return null;
          }
          const updated = { ...prev, content: prev.content + chunk };
          assistantMessageRef.current = updated;
          return updated;
        });
      },
      (error) => {
        let errorMessage = "A apărut o eroare necunoscută.";
        if (error instanceof Error) {
          errorMessage = `Scuze, eroare: ${error.message}`;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error) {
          try { errorMessage = JSON.stringify(error); } catch { /* ignore */ }
        }

        setCurrentAssistantMessage(prev => {
          if (!prev) {
            return null;
          }
          const updated = { ...prev, content: errorMessage };
          assistantMessageRef.current = updated;
          return updated;
        });
      },
      () => {
        if (assistantMessageRef.current && 
            assistantMessageRef.current.content.trim() &&
            assistantMessageRef.current.id &&
            assistantMessageRef.current.role) {
          
          // Capture the message value BEFORE nullifying the ref to prevent race conditions
          const finalMessage = assistantMessageRef.current;
          setSafeMessages(prev => [...prev, finalMessage]);
        }
        
        setCurrentAssistantMessage(null);
        assistantMessageRef.current = null;
        setIsLoading(false);
      }
    );
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleLocalSendMessage();
  };

  // Generate a consistent color based on agent ID for message styling
  const getAgentColor = (agentId: string) => {
    // Simple hash function to generate a consistent hue from agent ID
    const hash = agentId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    const hue = hash % 360; // 0-359 for hue value
    return `hsla(${hue}, 85%, 96%, 1)`;
  };

  // Safe wrapper for setMessages that validates all messages
  const setSafeMessages = useCallback((newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    const validateAndFilter = (msgs: Message[]): Message[] => {
      const validMessages = msgs.filter((msg) => {
        if (!msg) {
          return false;
        }
        if (typeof msg.id !== 'string') {
          return false;
        }
        if (typeof msg.role !== 'string') {
          return false;
        }
        if (typeof msg.content !== 'string') {
          return false;
        }
        if (typeof msg.timestamp !== 'number') {
          return false;
        }
        return true;
      });
      
      return validMessages;
    };
    
    if (typeof newMessages === 'function') {
      setMessages(prev => {
        const result = newMessages(prev);
        const validated = validateAndFilter(result);
        return validated;
      });
    } else {
      const validated = validateAndFilter(newMessages);
      setMessages(validated);
    }
  }, []);

  return (
    <div className="p-4 flex-grow overflow-hidden flex flex-col h-full" id="agents-tab-interface">
      <div className="mb-4 shrink-0" id="agents-tab-agent-select-container">
        <div className="flex justify-between items-center" id="agents-tab-agent-selector">
          {/* Default agent (left side) */}
          <div className="flex items-center">
            {selectedAgentId && availableAgents?.find((a: AiAgent) => a.id === selectedAgentId) && (
              <div className="flex items-center gap-2">
                <Avatar 
                  className={clsx(
                    "h-12 w-12 circular-avatar agent-avatar-selector agent-avatar-selected", 
                  )}
                  title={availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.name || "Agent"}
                >
                  {availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.avatarUrl ? (
                    <AvatarImage
                      src={availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.avatarUrl || ''}
                      alt={availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.name || "Agent"}
                    />
                  ) : (
                    <AvatarFallback><Bot size={24} /></AvatarFallback>
                  )}
                </Avatar>
                <div className="text-sm font-medium">
                  {availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.name || "Agent"}
                </div>
                
                {/* History status indicator */}
                {historySaved && (
                  <div className="history-indicator ml-2" title="Conversație salvată">
                    {showSavedIndicator && <Check size={12} />}
                    <History size={12} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat history dropdown menu */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Istoric conversație</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearConversation}>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Șterge conversația</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportConversation}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Exportă conversația</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Other agents (right side) */}
            {!isLoadingAgents && availableAgents?.filter((a: AiAgent) => a.id !== selectedAgentId).map((agent: AiAgent, index: number) => (
              <Avatar
                key={agent.id}
                className={clsx(
                  "h-10 w-10 circular-avatar agent-avatar-selector",
                  "border-2 border-white",
                  "-ml-2 first:ml-0"
                )}
                style={{ zIndex: availableAgents.length - index }}
                onClick={() => handleAgentChange(agent.id)}
                title={agent.name}
              >
                {agent.avatarUrl ? (
                  <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                ) : (
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                )}
              </Avatar>
            ))}
            
            {/* Manage Agents Link */}
            <Link href="/agents" className="manage-agents-link">
              <Settings size={12} />
              <span>Management</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div ref={messagesContainerRef} className="flex-grow overflow-auto border rounded-md p-4 bg-background mb-4" id="agents-tab-messages-container">
        {messages.filter(Boolean).map((message) => {
          // Safety check - ensure message exists and has required properties
          if (!message || !message.id || !message.role) {
            return null;
          }
          
          // Check if this is a transition message
          const isTransitionMessage = message.role === 'assistant' && message.content.includes('s-a alăturat conversației');
          
          // Get the agent for this message
          const messageAgent = message.agentId 
            ? availableAgents?.find((a: AiAgent) => a.id === message.agentId)
            : null;
          
          // Generate consistent styling for agent messages
          const messageStyle = selectedAgentId && message.role === 'assistant' && !isTransitionMessage
            ? { 
                backgroundColor: getAgentColor(message.agentId || selectedAgentId), 
                borderLeft: `3px solid hsla(${(message.agentId || selectedAgentId).charCodeAt(0) % 360}, 70%, 50%, 0.7)` 
              }
            : {};
          
          return (
            <div
              key={message.id}
              className={clsx("flex items-start gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              id={`message-${message.id}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-12 w-12 circular-avatar" id={`chat-assistant-avatar-${message.id}`}>
                  {messageAgent?.avatarUrl ? (
                    <AvatarImage src={messageAgent.avatarUrl} alt={messageAgent.name || 'Assistant'} />
                  ) : (
                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                  )}
                </Avatar>
              )}
              <div
                className={clsx("rounded-lg p-3 text-sm max-w-[80%]", {
                  "bg-primary text-primary-foreground": message.role === "user",
                  "bg-blue-100 text-blue-800 italic border border-blue-200": isTransitionMessage,
                  "bg-muted text-muted-foreground": message.role === "assistant" && !isTransitionMessage,
                })}
                style={messageStyle}
                id={`message-content-${message.id}`}
              >
                {/* Always show agent name for assistant messages */}
                {message.role === "assistant" && !isTransitionMessage && messageAgent && (
                  <div className="text-xs text-gray-500 mb-1 font-medium" id={`message-role-${message.id}`}>
                    {messageAgent.name || 'Assistant'}
                  </div>
                )}
                
                {!isTransitionMessage ? (
                  <div id={`message-markdown-${message.id}`}>
                    <ReactMarkdown>
                       {message.content || ''}
                    </ReactMarkdown>
                  </div>
                ) : (
                   <div id={`message-text-${message.id}`}>{message.content || ''}</div>
                )}
              </div>
              {message.role === "user" && (
                <Avatar className="h-12 w-12 circular-avatar" id={`chat-user-avatar-${message.id}`}>
                  <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        {currentAssistantMessage && (
          <div className="flex items-start gap-3 justify-start" id={`message-${currentAssistantMessage.id}-streaming`}>
            <Avatar className="h-12 w-12 circular-avatar" id={`chat-assistant-avatar-${currentAssistantMessage.id}-streaming`}>
              {availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.avatarUrl ? (
                <AvatarImage 
                  src={availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.avatarUrl || ''} 
                  alt={availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.name || 'Agent'} 
                />
              ) : (
                <AvatarFallback><Bot size={20} /></AvatarFallback>
              )}
            </Avatar>
            <div
              className="rounded-lg p-3 text-sm bg-muted text-muted-foreground max-w-[80%]"
              style={selectedAgentId ? { 
                backgroundColor: getAgentColor(selectedAgentId), 
                borderLeft: `3px solid hsla(${selectedAgentId.charCodeAt(0) % 360}, 70%, 50%, 0.7)` 
              } : {}}
              id={`message-content-${currentAssistantMessage.id}-streaming`}
            >
              <div className="text-xs text-gray-500 mb-1 font-medium" id={`message-role-${currentAssistantMessage.id}-streaming`}>
                 {availableAgents?.find((a: AiAgent) => a.id === selectedAgentId)?.name || "Agent"}
              </div>
              <div id={`message-markdown-${currentAssistantMessage.id}-streaming`}>
                <ReactMarkdown>
                    {currentAssistantMessage.content}
                </ReactMarkdown>
              </div>
              {isLoading && <Loader2 className="animate-spin h-3 w-3 ml-1 inline-block" id="message-streaming-loader" />}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} id="agents-tab-messages-end" />
      </div>

      {/* Input Area */}
      <div className="shrink-0" id="agents-tab-input-container">
        <div className="flex gap-2">
          <Textarea
            placeholder="Scrie mesajul tău..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleLocalSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-grow min-h-[40px] max-h-[120px] resize-none"
            id="agents-tab-input"
          />
          <Button onClick={handleButtonClick} disabled={isLoading || !input.trim()} size="icon" className="shrink-0" id="agents-tab-send-button">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentsTab; 