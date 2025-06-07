import { useState, useEffect, useCallback, useMemo } from 'react';

// Import types from AgentsPage
export interface AiAgent {
  id: string;
  name: string;
  description?: string | null;
  systemInstruction: string;
  temperature?: number;
  model: string;
  personalityTags?: string[];
  avatarUrl?: string;
  avatarType?: string;
  avatarPrompt?: string;
  isPublic?: boolean;
  isOwner?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiAgentDocument {
  id: number;
  fileName: string;
  fileSize?: number;
}

// Props interface matching AgentsPage
export interface AgentManagementProps {
  // React Query
  useMutation: any;
  useQueryClient: any;
  useQuery: any;
  
  // API functions and hooks
  useAiAgents: () => any;
  useAiAgent: any;
  createAiAgent: (agent: any) => Promise<AiAgent>;
  updateAiAgent: (id: string, agentData: any) => Promise<AiAgent>;
  deleteAiAgent: (id: string) => Promise<void>;
  uploadAiAgentDocument: (agentId: string, file: File) => Promise<any>;
  deleteAiAgentDocument: (agentId: string, documentId: number) => Promise<void>;
  useAiAgentDocuments: (agentId: string) => any;
  aiAgentKeys: any;
  uploadAiAgentAvatar: (agentId: string, file: File) => Promise<any>;
  generateAiAgentAvatar: (agentId: string, prompt: string) => Promise<any>;
  shareAiAgent: (id: string, isPublic: boolean) => Promise<AiAgent>;
  
  // Hooks
  useToast: () => any;
  
  // Services
  agentService: any;
  toastService: any;
}

// Available personality tags
export const PERSONALITY_TAGS = [
  'Formal', 'Creative', 'Technical', 'Friendly', 'Professional', 
  'Concise', 'Detailed', 'Humorous', 'Serious', 'Analytical'
];

export const useAgentManagement = (props: AgentManagementProps) => {
  const {
    useMutation,
    useQueryClient,
    useAiAgents,
    createAiAgent,
    updateAiAgent,
    deleteAiAgent,
    uploadAiAgentDocument,
    deleteAiAgentDocument,
    useAiAgentDocuments,
    aiAgentKeys,
    uploadAiAgentAvatar,
    generateAiAgentAvatar,
    shareAiAgent,
    useToast
  } = props;

  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Agent data
  const { data: agents, isLoading: isLoadingAgents, error: errorAgents } = useAiAgents();
  
  // State
  const [selectedAgent, setSelectedAgent] = useState<AiAgent | null>(null);
  const [newAgent, setNewAgent] = useState<Partial<AiAgent>>({
    name: '',
    description: '',
    systemInstruction: '',
    temperature: 0.7,
    model: 'gpt-4o',
    personalityTags: []
  });
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedAgentForChat, setSelectedAgentForChat] = useState<AiAgent | null>(null);
  
  // Form states
  const [documents, setDocuments] = useState<File[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [agentFilter, setAgentFilter] = useState<'all' | 'own' | 'public'>('all');

  // Documents for selected agent
  const { 
    data: agentDocuments, 
    isLoading: isLoadingDocuments 
  } = useAiAgentDocuments(selectedAgent?.id || '');

  // Mutations
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ agentId, file }: { agentId: string, file: File }) => uploadAiAgentDocument(agentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiAgentKeys.documents(selectedAgent?.id || '') });
      toast({
        title: "Document încărcat",
        description: "Documentul a fost încărcat cu succes.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare Încărcare Document",
        description: `Nu s-a putut încărca documentul: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: ({ agentId, documentId }: { agentId: string, documentId: number }) => 
      deleteAiAgentDocument(agentId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiAgentKeys.documents(selectedAgent?.id || '') });
      toast({
        title: "Document șters",
        description: "Documentul a fost șters cu succes.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare Ștergere Document",
        description: `Nu s-a putut șterge documentul: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateAgentMutation = useMutation({
    mutationFn: ({ id, agentData }: { id: string, agentData: any }) => updateAiAgent(id, agentData),
    onSuccess: (data: AiAgent) => {
      queryClient.invalidateQueries({ queryKey: aiAgentKeys.lists() });
      setIsEditDialogOpen(false);
      setSelectedAgent(null);
      toast({
        title: "Agent actualizat",
        description: `Agentul "${data.name}" a fost actualizat cu succes.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare Actualizare Agent",
        description: `Nu s-a putut actualiza agentul: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteAgentMutation = useMutation({
    mutationFn: (id: string) => deleteAiAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiAgentKeys.lists() });
      setIsDeleteDialogOpen(false);
      setSelectedAgent(null);
      toast({
        title: "Agent șters",
        description: "Agentul a fost șters cu succes.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare Ștergere Agent",
        description: `Nu s-a putut șterge agentul: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const shareAgentMutation = useMutation({
    mutationFn: ({ id, isPublic }: { id: string, isPublic: boolean }) => {
      return shareAiAgent(id, isPublic);
    },
    onSuccess: (data: AiAgent) => {
      queryClient.invalidateQueries({ queryKey: aiAgentKeys.lists() });
      toast({
        title: data.isPublic ? "Agent partajat" : "Agent privat",
        description: data.isPublic 
          ? `Agentul "${data.name}" este acum disponibil pentru toți utilizatorii.` 
          : `Agentul "${data.name}" este acum privat.`,
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('[Share] Error:', error);
      toast({
        title: "Eroare",
        description: `Nu s-a putut schimba starea de partajare: ${error.message || 'Eroare necunoscută'}`,
        variant: "destructive",
      });
    },
  });

  const createAgentMutation = useMutation({
    mutationFn: async (agent: Omit<AiAgent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const agentToCreate = { 
        ...agent, 
        description: agent.description || null, 
        temperature: agent.temperature ?? 0.7, 
        model: agent.model || 'gpt-4o', 
        personalityTags: agent.personalityTags || [] 
      };
      return createAiAgent(agentToCreate);
    },
    onSuccess: (data: AiAgent) => {
      const agentId = data.id;
      
      // Invalidate list query first
      queryClient.invalidateQueries({ queryKey: aiAgentKeys.lists() });

      // Upload associated documents if any
      if (documents.length > 0 && agentId) {
        const uploadPromises = documents.map(file => 
          uploadDocumentMutation.mutateAsync({ agentId, file })
        );
        
        Promise.allSettled(uploadPromises).then(results => {
          const failedUploads = results.filter(r => r.status === 'rejected');
          if (failedUploads.length > 0) {
            console.error("Some documents failed to upload:", failedUploads);
            toast({
              title: "Eroare Încărcare Documente",
              description: `Nu s-au putut încărca ${failedUploads.length} documente.`,
              variant: "destructive",
            });
          }
        });
      }
      
      // Upload avatar if we have one
      if (avatarFile && agentId) {
        uploadAiAgentAvatar(agentId, avatarFile)
          .then(result => {
            console.log("Avatar uploaded successfully:", result);
            queryClient.invalidateQueries({ queryKey: aiAgentKeys.detail(agentId) });
          })
          .catch(error => {
            console.error("Failed to upload avatar:", error);
            toast({
              title: "Eroare Încărcare Avatar",
              description: `Nu s-a putut încărca avatar-ul: ${error.message}`,
              variant: "destructive",
            });
          });
      }
      // Generate avatar if we have a prompt but no file
      else if (avatarPrompt && agentId && !avatarFile) {
        generateAiAgentAvatar(agentId, avatarPrompt)
          .then(result => {
            console.log("Avatar generated successfully:", result);
            queryClient.invalidateQueries({ queryKey: aiAgentKeys.detail(agentId) });
          })
          .catch(error => {
            console.error("Failed to generate avatar:", error);
            toast({
              title: "Eroare Generare Avatar",
              description: `Nu s-a putut genera avatar-ul: ${error.message}`,
              variant: "destructive",
            });
          });
      }
      
      // Clear form and close dialog
      setNewAgent({
        name: '',
        description: '',
        systemInstruction: '',
        temperature: 0.7,
        model: 'gpt-4o',
        personalityTags: []
      });
      setDocuments([]);
      setAvatarFile(null);
      setAvatarPrompt('');
      setIsCreateDialogOpen(false);
      toast({
        title: "Agent creat",
        description: `Agentul "${data.name}" a fost creat cu succes.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare Creare Agent",
        description: `Nu s-a putut crea agentul: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Event handlers
  const handleCreateAgent = useCallback(() => {
    if (!newAgent.name || !newAgent.systemInstruction) {
      toast({ 
        title: "Eroare", 
        description: "Numele agentului și instrucțiunea de sistem sunt obligatorii.", 
        variant: "destructive" 
      });
      return;
    }
    createAgentMutation.mutate(newAgent as Omit<AiAgent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
  }, [newAgent, toast, createAgentMutation]);
  
  const handleUpdateAgent = useCallback(() => {
    if (!selectedAgent) return;
    updateAgentMutation.mutate({ id: selectedAgent.id, agentData: selectedAgent });
  }, [selectedAgent, updateAgentMutation]);
  
  const handleDeleteAgent = useCallback(() => {
    if (!selectedAgent) return;
    deleteAgentMutation.mutate(selectedAgent.id);
  }, [selectedAgent, deleteAgentMutation]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      if (isEditDialogOpen && selectedAgent) {
        fileArray.forEach(file => {
          uploadDocumentMutation.mutate({ agentId: selectedAgent!.id, file });
        });
      } else {
        setDocuments(prev => [...prev, ...fileArray]);
      }
      e.target.value = ''; 
    }
  }, [isEditDialogOpen, selectedAgent, uploadDocumentMutation]);
  
  const removeFile = useCallback((index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const handleDeleteDocument = useCallback((documentId: number) => {
    if (!selectedAgent) return;
    deleteDocumentMutation.mutate({ agentId: selectedAgent.id, documentId });
  }, [selectedAgent, deleteDocumentMutation]);
  
  const handleEditAgent = useCallback((agent: AiAgent) => {
    setSelectedAgent({ ...agent });
    setDocuments([]);
    setIsEditDialogOpen(true);
  }, []);
  
  const handleOpenChat = useCallback((agent: AiAgent) => {
    setSelectedAgentForChat(agent);
    setIsChatModalOpen(true);
  }, []);

  const addCustomTag = useCallback(() => {
    if (customTag && !newAgent.personalityTags?.includes(customTag)) {
      const updatedTags = [...(newAgent.personalityTags || []), customTag];
      if (isEditDialogOpen && selectedAgent) {
        setSelectedAgent(prev => prev ? { ...prev, personalityTags: updatedTags } : null);
      } else {
        setNewAgent(prev => ({ ...prev, personalityTags: updatedTags }));
      }
      setCustomTag('');
    }
  }, [customTag, newAgent.personalityTags, isEditDialogOpen, selectedAgent]);
  
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    if (isEditDialogOpen && selectedAgent) {
      setSelectedAgent(prev => prev ? { 
        ...prev, 
        personalityTags: prev.personalityTags?.filter(tag => tag !== tagToRemove) || [] 
      } : null);
    } else {
      setNewAgent(prev => ({ 
        ...prev, 
        personalityTags: prev.personalityTags?.filter(tag => tag !== tagToRemove) || [] 
      }));
    }
  }, [isEditDialogOpen, selectedAgent]);
  
  const handleSelectTag = useCallback((tag: string) => {
    if (isEditDialogOpen && selectedAgent) {
      const currentTags = selectedAgent.personalityTags || [];
      const updatedTags = currentTags.includes(tag) 
        ? currentTags.filter(t => t !== tag) 
        : [...currentTags, tag];
      setSelectedAgent(prev => prev ? { ...prev, personalityTags: updatedTags } : null);
    } else {
      const currentTags = newAgent.personalityTags || [];
      const updatedTags = currentTags.includes(tag) 
        ? currentTags.filter(t => t !== tag) 
        : [...currentTags, tag];
      setNewAgent(prev => ({ ...prev, personalityTags: updatedTags }));
    }
  }, [isEditDialogOpen, selectedAgent, newAgent.personalityTags]);
  
  // Avatar handling
  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      e.target.value = '';
    }
  }, []);
  
  const handleGenerateAvatar = useCallback(async () => {
    if (!selectedAgent && !newAgent.name) return;
    
    setIsGeneratingAvatar(true);
    const prompt = avatarPrompt || `A professional avatar for an AI agent named ${selectedAgent?.name || newAgent.name}`;
    
    try {
      if (isEditDialogOpen && selectedAgent) {
        const result = await generateAiAgentAvatar(selectedAgent.id, prompt);
        setSelectedAgent(prev => prev ? { 
          ...prev, 
          avatarUrl: result.avatarUrl, 
          avatarType: 'generated', 
          avatarPrompt: prompt 
        } : null);
        
        toast({
          title: "Avatar Generat",
          description: "Avatar-ul a fost generat cu succes.",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Eroare Generare Avatar",
        description: `Nu s-a putut genera avatar-ul: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  }, [selectedAgent, newAgent.name, avatarPrompt, isEditDialogOpen, generateAiAgentAvatar, toast]);
  
  // Upload avatar for an existing agent
  const handleUploadAvatar = useCallback(async () => {
    if (!avatarFile || !selectedAgent) return;
    
    try {
      const result = await uploadAiAgentAvatar(selectedAgent.id, avatarFile);
      setSelectedAgent(prev => prev ? { 
        ...prev, 
        avatarUrl: result.avatarUrl, 
        avatarType: 'uploaded' 
      } : null);
      setAvatarFile(null);
      
      toast({
        title: "Avatar Încărcat",
        description: "Avatar-ul a fost încărcat cu succes.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Eroare Încărcare Avatar",
        description: `Nu s-a putut încărca avatar-ul: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [avatarFile, selectedAgent, uploadAiAgentAvatar, toast]);
  
  // Effect to automatically upload avatar when file is selected and in edit mode
  useEffect(() => {
    if (avatarFile && selectedAgent && isEditDialogOpen) {
      handleUploadAvatar();
    }
  }, [avatarFile, selectedAgent, isEditDialogOpen, handleUploadAvatar]);
  
  // Filtered agents based on selected filter
  const filteredAgents = useMemo(() => {
    if (!agents) return [];
    
    switch (agentFilter) {
      case 'own':
        return agents.filter((agent: AiAgent) => agent.isOwner);
      case 'public':
        return agents.filter((agent: AiAgent) => agent.isPublic && !agent.isOwner);
      default:
        return agents;
    }
  }, [agents, agentFilter]);
  
  const handleShareAgent = useCallback((agent: AiAgent) => {
    shareAgentMutation.mutate({ id: agent.id, isPublic: !agent.isPublic });
  }, [shareAgentMutation]);

  // Wrapped setters to ensure proper typing
  const wrappedSetNewAgent = useCallback((value: any) => {
    if (typeof value === 'function') {
      setNewAgent(prev => value(prev));
    } else {
      setNewAgent(value);
    }
  }, []);

  const wrappedSetSelectedAgent = useCallback((value: any) => {
    if (typeof value === 'function') {
      setSelectedAgent(prev => value(prev));
    } else {
      setSelectedAgent(value);
    }
  }, []);

  return {
    // Data
    agents: filteredAgents,
    isLoadingAgents,
    errorAgents,
    agentDocuments,
    isLoadingDocuments,
    
    // Selected agent state
    selectedAgent,
    setSelectedAgent,
    newAgent,
    setNewAgent: wrappedSetNewAgent,
    
    // Dialog states
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isChatModalOpen,
    setIsChatModalOpen,
    selectedAgentForChat,
    setSelectedAgentForChat,
    
    // Form states
    documents,
    setDocuments,
    avatarFile,
    setAvatarFile,
    avatarPrompt,
    setAvatarPrompt,
    isGeneratingAvatar,
    customTag,
    setCustomTag,
    agentFilter,
    setAgentFilter,
    
    // Mutations
    createAgentMutation,
    updateAgentMutation,
    deleteAgentMutation,
    shareAgentMutation,
    uploadDocumentMutation,
    deleteDocumentMutation,
    
    // Handlers
    handleCreateAgent,
    handleUpdateAgent,
    handleDeleteAgent,
    handleFileChange,
    removeFile,
    handleDeleteDocument,
    handleEditAgent,
    handleOpenChat,
    addCustomTag,
    handleRemoveTag,
    handleSelectTag,
    handleAvatarChange,
    handleGenerateAvatar,
    handleUploadAvatar,
    handleShareAgent,
    wrappedSetSelectedAgent,
    
    // Constants
    PERSONALITY_TAGS
  };
}; 