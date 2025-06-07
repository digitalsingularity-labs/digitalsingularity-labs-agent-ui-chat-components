import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';

// Library types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface AiAgent {
  id: string;
  name: string;
  description?: string | null;
  model: string;
  temperature?: number;
  avatarUrl?: string | null;
}

export interface UIComponents {
  Dialog: React.ComponentType<any>;
  DialogContent: React.ComponentType<any>;
  DialogHeader: React.ComponentType<any>;
  DialogTitle: React.ComponentType<any>;
  DialogDescription: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  ScrollArea: React.ComponentType<any>;
  Avatar: React.ComponentType<any>;
  AvatarFallback: React.ComponentType<any>;
  AvatarImage: React.ComponentType<any>;
}

export interface AgentService {
  sendMessage(
    message: string,
    agentId: string,
    onChunk: (chunk: string) => void,
    onError: (error: any) => void,
    onCompletion: () => void
  ): Promise<void>;
  
  getUserAvatar?(): Promise<string | null>;
}

export interface ToastService {
  toast(options: { title?: string; description?: string; variant?: 'default' | 'destructive' }): void;
}

export interface AgentChatModalProps {
  agent: AiAgent | null;
  isOpen: boolean;
  onClose: () => void;
  
  // Dependency injection
  uiComponents: UIComponents;
  agentService: AgentService;
  toastService?: ToastService;
  
  // Optional customization
  className?: string;
  maxMessages?: number;
  enableHistory?: boolean;
}

const AgentChatModal: React.FC<AgentChatModalProps> = ({
  agent,
  isOpen,
  onClose,
  uiComponents,
  agentService,
  toastService,
  className = "",
  maxMessages = 100,
  enableHistory = true
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  let assistantResponseId: string | null = null;

  const {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Button,
    Input,
    ScrollArea,
    Avatar,
    AvatarFallback,
    AvatarImage
  } = uiComponents;

  // Storage functions
  const getStorageKey = useCallback((agentId: string) => {
    return `agent_chat_history_${agentId}`;
  }, []);

  const saveConversation = useCallback(() => {
    if (!agent || messages.length === 0 || !enableHistory) return;
    
    try {
      const storageKey = getStorageKey(agent.id);
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }, [agent, messages, getStorageKey, enableHistory]);

  const loadConversation = useCallback(() => {
    if (!agent || !enableHistory) return;
    
    try {
      const storageKey = getStorageKey(agent.id);
      const savedChat = localStorage.getItem(storageKey);
      
      if (savedChat) {
        const savedMessages = JSON.parse(savedChat) as ChatMessage[];
        setMessages(savedMessages.slice(-maxMessages)); // Limit message count
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      if (agent) {
        localStorage.removeItem(getStorageKey(agent.id));
      }
    }
  }, [agent, getStorageKey, enableHistory, maxMessages]);

  const clearConversation = useCallback(() => {
    if (!agent) return;
    
    try {
      const storageKey = getStorageKey(agent.id);
      localStorage.removeItem(storageKey);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  }, [agent, getStorageKey]);

  const fetchUserProfile = async () => {
    try {
      if (agentService.getUserAvatar) {
        const avatarUrl = await agentService.getUserAvatar();
        setUserAvatarUrl(avatarUrl);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        requestAnimationFrame(() => {
          scrollViewport.scrollTop = scrollViewport.scrollHeight;
        });
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 50);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      saveConversation();
    }
  }, [messages, isLoading, saveConversation]);

  useEffect(() => {
    if (isOpen && agent) {
      if (messages.length === 0) {
        loadConversation();
      }
      fetchUserProfile();
    }
  }, [isOpen, agent, loadConversation, messages.length]);

  useEffect(() => {
    if (isOpen && agent) {
      setInput('');
      setIsLoading(false);
      abortControllerRef.current?.abort();
    } else {
      abortControllerRef.current?.abort();
    }
    
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [isOpen, agent]);

  const handleSendMessage = async () => {
    if (!agent) return;

    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    abortControllerRef.current = new AbortController();
    assistantResponseId = (Date.now() + 1).toString();
    let accumulatedContent = '';
    let responseStarted = false;

    try {
      await agentService.sendMessage(
        userMessage,
        agent.id,
        // onChunk
        (chunk: string) => {
          accumulatedContent += chunk;
          if (!responseStarted) {
            setMessages(prev => [
              ...prev,
              { id: assistantResponseId!, role: 'assistant', content: accumulatedContent },
            ]);
            responseStarted = true;
          } else {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantResponseId
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
          }
        },
        // onError
        (error: any) => {
          console.error("Error sending message:", error);
          toastService?.toast({
            title: "Chat Error",
            description: `Failed to send message: ${error.message}`,
            variant: "destructive",
          });
        },
        // onCompletion
        () => {
          setIsLoading(false);
          abortControllerRef.current = null;
          assistantResponseId = null;
          setTimeout(() => scrollToBottom(), 0);
          setTimeout(() => focusInput(), 100);
        }
      );
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error sending message:", error);
        toastService?.toast({
          title: "Chat Error",
          description: `Failed to send message: ${error.message}`,
          variant: "destructive",
        });
      }
      setIsLoading(false);
      abortControllerRef.current = null;
      assistantResponseId = null;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen || !agent) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] flex flex-col max-h-[90vh] ${className}`} id="agent-chat-modal-content">
        <DialogHeader id="agent-chat-modal-header">
          <div className="flex items-center gap-3" id="agent-chat-modal-agent-info">
            <Avatar className="h-10 w-10">
              {agent.avatarUrl ? (
                <AvatarImage src={agent.avatarUrl} alt={agent.name} />
              ) : (
                <AvatarFallback><Bot size={24} /></AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <DialogTitle>Chat with Agent: {agent.name}</DialogTitle>
                {enableHistory && messages.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearConversation}
                    className="text-xs mr-10"
                    id="agent-chat-clear-history-btn"
                  >
                    Clear History
                  </Button>
                )}
              </div>
              <DialogDescription>
                Model: {agent.model}
                {agent.temperature && `, Temperature: ${agent.temperature.toFixed(1)}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Chat messages area */}
        <ScrollArea className="flex-grow border rounded-md p-4 h-[50vh] bg-background" ref={scrollAreaRef} id="agent-chat-messages-area">
          <div className="space-y-4" id="agent-chat-messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
                id={`agent-chat-message-${message.id}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    {agent.avatarUrl ? (
                      <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                    ) : (
                      <AvatarFallback><Bot size={18} /></AvatarFallback>
                    )}
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 text-sm max-w-[75%] whitespace-pre-wrap break-words ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    {userAvatarUrl ? (
                      <AvatarImage src={userAvatarUrl} alt="User" />
                    ) : (
                      <AvatarFallback><User size={18} /></AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && !messages.some(m => m.role === 'assistant' && m.id === assistantResponseId) && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  {agent.avatarUrl ? (
                    <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                  ) : (
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                  )}
                </Avatar>
                <div className="rounded-lg p-3 text-sm bg-muted text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="flex items-center p-1 pt-0 gap-2 border-t pt-4" id="agent-chat-input-area">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow"
            id="agent-chat-message-input"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon" id="agent-chat-send-btn">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentChatModal; 