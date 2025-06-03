import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Type definitions for dependency injection
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

// Props interface for the complete AgentsPage component
export interface AgentsPageProps {
  // Navigation
  useLocation: () => [string, (path: string) => void];
  
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
  
  // UI Components - all as React components
  Card: React.ComponentType<any>;
  CardHeader: React.ComponentType<any>;
  CardTitle: React.ComponentType<any>;
  CardDescription: React.ComponentType<any>;
  CardContent: React.ComponentType<any>;
  Table: React.ComponentType<any>;
  TableHeader: React.ComponentType<any>;
  TableRow: React.ComponentType<any>;
  TableHead: React.ComponentType<any>;
  TableBody: React.ComponentType<any>;
  TableCell: React.ComponentType<any>;
  Dialog: React.ComponentType<any>;
  DialogContent: React.ComponentType<any>;
  DialogHeader: React.ComponentType<any>;
  DialogTitle: React.ComponentType<any>;
  DialogDescription: React.ComponentType<any>;
  DialogFooter: React.ComponentType<any>;
  DialogTrigger: React.ComponentType<any>;
  DialogClose: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  AlertDialog: React.ComponentType<any>;
  AlertDialogAction: React.ComponentType<any>;
  AlertDialogCancel: React.ComponentType<any>;
  AlertDialogContent: React.ComponentType<any>;
  AlertDialogDescription: React.ComponentType<any>;
  AlertDialogFooter: React.ComponentType<any>;
  AlertDialogHeader: React.ComponentType<any>;
  AlertDialogTitle: React.ComponentType<any>;
  Select: React.ComponentType<any>;
  SelectContent: React.ComponentType<any>;
  SelectItem: React.ComponentType<any>;
  SelectTrigger: React.ComponentType<any>;
  SelectValue: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  Textarea: React.ComponentType<any>;
  Checkbox: React.ComponentType<any>;
  Badge: React.ComponentType<any>;
  Tabs: React.ComponentType<any>;
  TabsContent: React.ComponentType<any>;
  TabsList: React.ComponentType<any>;
  TabsTrigger: React.ComponentType<any>;
  Tooltip: React.ComponentType<any>;
  TooltipContent: React.ComponentType<any>;
  TooltipProvider: React.ComponentType<any>;
  TooltipTrigger: React.ComponentType<any>;
  Slider: React.ComponentType<any>;
  Alert: React.ComponentType<any>;
  AlertDescription: React.ComponentType<any>;
  AlertTitle: React.ComponentType<any>;
  Avatar: React.ComponentType<any>;
  AvatarImage: React.ComponentType<any>;
  AvatarFallback: React.ComponentType<any>;
  
  // Icons - all as React components
  Loader2: React.ComponentType<any>;
  Trash2: React.ComponentType<any>;
  Edit: React.ComponentType<any>;
  Plus: React.ComponentType<any>;
  Upload: React.ComponentType<any>;
  File: React.ComponentType<any>;
  X: React.ComponentType<any>;
  Bot: React.ComponentType<any>;
  Thermometer: React.ComponentType<any>;
  Tag: React.ComponentType<any>;
  FileText: React.ComponentType<any>;
  PlusCircle: React.ComponentType<any>;
  MessageSquare: React.ComponentType<any>;
  AlertCircle: React.ComponentType<any>;
  Globe: React.ComponentType<any>;
  Share2: React.ComponentType<any>;
  
  // Hooks
  useToast: () => any;
  
  // Chat Modal (already from library)
  AgentChatModal: React.ComponentType<any>;
  
  // Profile Menu component
  ProfileMenu: React.ComponentType<any>;
  
  // Services
  agentService: any;
  toastService: any;
  uiComponents: any;
}

// Define available personality tags
const PERSONALITY_TAGS = [
  'Formal', 'Creative', 'Technical', 'Friendly', 'Professional', 
  'Concise', 'Detailed', 'Humorous', 'Serious', 'Analytical'
];

// Props for the extracted form fields component
interface AgentFormFieldsProps {
  agentData: Partial<AiAgent>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  documents: File[];
  setDocuments: React.Dispatch<React.SetStateAction<File[]>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  isEditDialogOpen: boolean;
  agentDocuments?: AiAgentDocument[] | null;
  isLoadingDocuments: boolean;
  handleDeleteDocument: (documentId: number) => void;
  deleteDocumentMutation: any;
  personalityOptions: string[];
  customTag: string;
  setCustomTag: React.Dispatch<React.SetStateAction<string>>;
  handleAddTag: () => void;
  handleRemoveTag: (tagToRemove: string) => void;
  handleSelectTag: (tag: string) => void;
  avatarFile?: File | null;
  setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateAvatar: () => void;
  isGeneratingAvatar?: boolean;
  avatarPrompt: string;
  setAvatarPrompt: React.Dispatch<React.SetStateAction<string>>;
  showSharingOption?: boolean;
  // UI Components props
  Label: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Textarea: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  Select: React.ComponentType<any>;
  SelectTrigger: React.ComponentType<any>;
  SelectValue: React.ComponentType<any>;
  SelectContent: React.ComponentType<any>;
  SelectItem: React.ComponentType<any>;
  Slider: React.ComponentType<any>;
  Badge: React.ComponentType<any>;
  Tabs: React.ComponentType<any>;
  TabsList: React.ComponentType<any>;
  TabsTrigger: React.ComponentType<any>;
  TabsContent: React.ComponentType<any>;
  Checkbox: React.ComponentType<any>;
  Upload: React.ComponentType<any>;
  Bot: React.ComponentType<any>;
  Loader2: React.ComponentType<any>;
  X: React.ComponentType<any>;
  Trash2: React.ComponentType<any>;
}

// Move AgentFormFields OUTSIDE the main component
const AgentFormFields: React.FC<AgentFormFieldsProps> = ({ 
  agentData, setData, documents, handleFileChange, removeFile, 
  isEditDialogOpen, agentDocuments, isLoadingDocuments, handleDeleteDocument, 
  deleteDocumentMutation, personalityOptions, customTag, setCustomTag, 
  handleAddTag, handleRemoveTag, handleSelectTag, avatarFile, 
  handleAvatarChange, handleGenerateAvatar, isGeneratingAvatar, avatarPrompt, setAvatarPrompt,
  showSharingOption = false,
  // UI Components
  Label, Input, Textarea, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Slider, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Checkbox, Upload, Bot, Loader2, X, Trash2
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Nume Agent</Label>
        <Input 
          id="agent-name-input" 
          value={agentData.name || ''} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setData((prev: Partial<AiAgent>) => ({ ...prev, name: e.target.value }));
          }} 
          placeholder="Ex: Asistent Documente Legale"
        />
      </div>

      {/* Avatar Section */}
      <div className="grid gap-2">
        <Label>Avatar Agent</Label>
        <div className="flex gap-4 items-start">
          {/* Avatar Preview */}
          <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex items-center justify-center" id="agent-avatar-preview">
            {agentData.avatarUrl ? (
              <img 
                src={agentData.avatarUrl} 
                alt={`Avatar for ${agentData.name || 'agent'}`}
                className="w-full h-full object-cover"
              />
            ) : avatarFile ? (
              <img 
                src={URL.createObjectURL(avatarFile)} 
                alt="Avatar preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Bot className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          
          {/* Avatar Controls */}
          <div className="flex-1 space-y-2">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Încarcă Imagine</TabsTrigger>
                <TabsTrigger value="generate">Generează cu AI</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-2">
                <Input id="agent-avatar-upload-input" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <Button asChild variant="outline" className="w-full" id="agent-avatar-upload-button">
                  <Label htmlFor="agent-avatar-upload-input" className="cursor-pointer flex items-center justify-center gap-1">
                    <Upload className="h-4 w-4" /> Selectează Imagine
                  </Label>
                </Button>
                {avatarFile && (
                  <p className="text-xs text-muted-foreground">{avatarFile.name}</p>
                )}
              </TabsContent>
              
              <TabsContent value="generate" className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    id="agent-avatar-prompt-input"
                    placeholder="Prompt pentru generare avatar"
                    value={avatarPrompt} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarPrompt(e.target.value)}
                  />
                  <Button 
                    id="agent-avatar-generate-button"
                    onClick={handleGenerateAvatar} 
                    disabled={isGeneratingAvatar || !agentData.name}
                    variant="outline"
                  >
                    {isGeneratingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Generarea poate dura câteva secunde. Se va folosi numele agentului ca referință.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descriere (Opțional)</Label>
        <Textarea 
          id="agent-description-textarea" 
          value={agentData.description || ''} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData((prev: Partial<AiAgent>) => ({ ...prev, description: e.target.value }))}
          placeholder="Ex: Ajută la crearea și revizuirea contractelor"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="systemInstruction">Instrucțiune Sistem</Label>
        <Textarea 
          id="agent-system-instruction-textarea" 
          value={agentData.systemInstruction || ''} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData((prev: Partial<AiAgent>) => ({ ...prev, systemInstruction: e.target.value }))} 
          placeholder="Ex: Ești un asistent AI specializat în documente legale..."
          rows={5}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="model">Model AI</Label>
        <Select 
          value={agentData.model || 'gpt-4'} 
          onValueChange={(value: string) => setData((prev: Partial<AiAgent>) => ({ ...prev, model: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selectează Model" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="gpt-4o">GPT-4o (Recomandat)</SelectItem>
             <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
         <Label htmlFor="temperature">Temperatură: {agentData.temperature?.toFixed(1)}</Label>
        <Slider
          id="agent-temperature-slider"
          min={0}
          max={1}
          step={0.1}
          value={[agentData.temperature || 0.7]}
           onValueChange={(value: number[]) => setData((prev: Partial<AiAgent>) => ({ ...prev, temperature: value[0] }))}
        />
        <p className="text-sm text-muted-foreground">Controlați caracterul aleatoriu: valori mai mici pentru răspunsuri mai concentrate.</p>
      </div>
      {/* Personality Tags */}
      <div className="grid gap-2">
        <Label>Etichete Personalitate (Opțional)</Label>
        <div className="flex flex-wrap gap-2">
          {personalityOptions.map(tag => (
            <Badge 
              key={tag} 
              variant={agentData.personalityTags?.includes(tag) ? "default" : "secondary"}
              onClick={() => handleSelectTag(tag)}
              className="cursor-pointer"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input 
            placeholder="Adaugă etichetă personalizată"
            value={customTag}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTag(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
          />
          <Button onClick={handleAddTag} variant="outline" size="sm">Adaugă</Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {agentData.personalityTags?.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
            </Badge>
          ))}
        </div>
      </div>
      {/* Document Upload Section - Conditional */}
      <div className="grid gap-2">
        <Label htmlFor="documents">Documente Context (Opțional)</Label>
         {/* Display uploaded documents only in Edit mode */}
         {isEditDialogOpen && agentDocuments && agentDocuments.length > 0 && (
           <div className="mt-2 space-y-2" id="agent-documents-list">
            <h4 className="text-sm font-medium">Documente Încărcate:</h4>
            {isLoadingDocuments && <p className="text-sm text-muted-foreground">Se încarcă documentele...</p>}
            <ul className="list-disc pl-5 text-sm">
              {agentDocuments.map((doc: AiAgentDocument) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <span title={doc.fileName}>{doc.fileName.length > 40 ? `${doc.fileName.substring(0, 37)}...` : doc.fileName} ({doc.fileSize ? (doc.fileSize / 1024).toFixed(1) : '0'} KB)</span>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => handleDeleteDocument(doc.id)} 
                    disabled={deleteDocumentMutation.isPending}
                    id={`agent-document-delete-${doc.id}`}
                  >
                     <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Display staged documents in Create mode */}
        {!isEditDialogOpen && documents.length > 0 && (
          <div className="mt-2 space-y-2" id="agent-staged-documents-list">
            <h4 className="text-sm font-medium">Documente Pregătite:</h4>
             <ul className="list-disc pl-5 text-sm">
              {documents.map((file, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span title={file.name}>{file.name.length > 40 ? `${file.name.substring(0, 37)}...` : file.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)} id={`agent-staged-document-delete-${index}`}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Input id="agent-document-upload-input" type="file" multiple onChange={handleFileChange} className="hidden" />
          <Button asChild variant="outline" id="agent-document-upload-button">
             <Label htmlFor="agent-document-upload-input" className="cursor-pointer flex items-center gap-1">
              <Upload className="h-4 w-4" /> Încarcă Documente
             </Label>
          </Button>
        </div>
         <p className="text-xs text-muted-foreground">
           Formate suportate pentru extragerea contextului: .txt, .pdf, .docx. 
           Primii 10.000 de caractere din fiecare document vor fi utilizați.
         </p>
      </div>

      {/* Sharing toggle - only show for existing agents */}
      {showSharingOption && (
        <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
          <Checkbox 
            id="agent-share-checkbox" 
            checked={!!agentData.isPublic}
            onCheckedChange={(checked: boolean) => setData((prev: Partial<AiAgent>) => ({ ...prev, isPublic: checked === true }))}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="agent-share-checkbox" className="text-sm font-medium leading-none flex items-center">
              Partajează cu toți utilizatorii
              {agentData.isPublic && <Badge variant="outline" className="ml-2 text-xs">Public</Badge>}
            </Label>
            <p className="text-xs text-muted-foreground">
              Alți utilizatori vor putea vedea și folosi acest agent AI, dar nu îl vor putea modifica.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const AgentsPage: React.FC<AgentsPageProps> = (props) => {
  // Extract all props
  const {
    useLocation,
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
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    Button,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Input,
    Label,
    Textarea,
    Checkbox,
    Badge,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Loader2,
    Trash2,
    Edit,
    Upload,
    X,
    Bot,
    PlusCircle,
    MessageSquare,
    AlertCircle,
    Share2,
    useToast,
    AgentChatModal,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Slider,
    Alert,
    AlertDescription,
    AlertTitle,
    ProfileMenu,
    Avatar,
    AvatarImage,
    AvatarFallback,
    agentService,
    toastService,
    uiComponents
  } = props;

  // State management (exact same as original)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AiAgent | null>(null);
  const [newAgent, setNewAgent] = useState<Partial<AiAgent>>({
    name: '',
    description: '',
    systemInstruction: '',
    temperature: 0.7,
    model: 'gpt-4o',
    personalityTags: []
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedAgentForChat, setSelectedAgentForChat] = useState<AiAgent | null>(null);
  
  // Avatar-related state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Navigation
  const [, navigate] = useLocation();

  // Add filter state for showing all/own/public agents
  const [agentFilter, setAgentFilter] = useState<'all' | 'own' | 'public'>('all');

  // Wrap setNewAgent to track when it's called
  const wrappedSetNewAgent = useCallback((updater: any) => {
    setNewAgent(updater);
  }, []);

  // Wrap setSelectedAgent to track when it's called
  const wrappedSetSelectedAgent = useCallback((updater: any) => {
    setSelectedAgent(updater);
  }, []);

  // Effect to check for hash in URL to open create modal
  useEffect(() => {
    if (window.location.hash === '#create') {
      setIsCreateDialogOpen(true);
    }
  }, []);

  // Fetching data
  const { 
    data: agents, 
    isLoading: isLoadingAgents, 
    isError: isErrorAgents,
    error: errorAgents
  } = useAiAgents();
  
  const agentIdForQuery = selectedAgent?.id ?? '';

  const { 
    data: agentDocuments, 
    isLoading: isLoadingDocuments, 
    refetch: refetchDocuments 
  } = useAiAgentDocuments(agentIdForQuery);
  
  // Refetch documents when selectedAgent changes and dialog is open
  useEffect(() => {
    if (isEditDialogOpen && selectedAgent) {
      refetchDocuments();
    }
  }, [isEditDialogOpen, selectedAgent, refetchDocuments]);

  // Mutations (exact same logic as original)
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ agentId, file }: { agentId: string, file: File }) => uploadAiAgentDocument(agentId, file),
    onSuccess: (_data: any, variables: { agentId: string, file: File }) => {
       // Invalidate the documents query for this specific agent to refresh the list
       queryClient.invalidateQueries({ queryKey: ['agentDocuments', variables.agentId] });
      toast({
        title: "Document încărcat",
         description: `Documentul "${variables.file.name}" a fost încărcat.`, // Use file name from variables
        variant: "default"
      });
    },
    onError: (error: Error, variables: { agentId: string, file: File }) => {
      toast({
        title: "Eroare Încărcare Document",
         description: `Nu s-a putut încărca documentul "${variables.file.name}": ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: ({ agentId, documentId }: { agentId: string, documentId: number }) => deleteAiAgentDocument(agentId, documentId),
    onSuccess: (_data: any, variables: { agentId: string, documentId: number }) => {
      queryClient.invalidateQueries({ queryKey: ['agentDocuments', variables.agentId] });
      toast({
        title: "Document șters",
        description: "Documentul a fost șters cu succes.",
        variant: "default"
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
        
        // Use Promise.allSettled to handle potential individual upload failures
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
            // Optionally update the local state or invalidate queries
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
            // Optionally update the local state or invalidate queries
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

  // Event handlers with useCallback to prevent recreation
  const handleCreateAgent = useCallback(() => {
    if (!newAgent.name || !newAgent.systemInstruction) {
        toast({ title: "Eroare", description: "Numele agentului și instrucțiunea de sistem sunt obligatorii.", variant: "destructive" });
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
      // Handle uploads immediately if editing an existing agent
      if (isEditDialogOpen && selectedAgent) {
        fileArray.forEach(file => {
           uploadDocumentMutation.mutate({ agentId: selectedAgent!.id, file }); // Non-null assertion ok here
        });
      } else {
        // Otherwise, store them for creation
      setDocuments(prev => [...prev, ...fileArray]);
      }
      // Clear the input value to allow selecting the same file again
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
    setSelectedAgent({ ...agent }); // Set the complete agent object
    setDocuments([]); // Clear staged documents when opening edit dialog
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
      setSelectedAgent(prev => prev ? { ...prev, personalityTags: prev.personalityTags?.filter(tag => tag !== tagToRemove) || [] } : null);
    } else {
      setNewAgent(prev => ({ ...prev, personalityTags: prev.personalityTags?.filter(tag => tag !== tagToRemove) || [] }));
    }
  }, [isEditDialogOpen, selectedAgent]);
  
  const handleSelectTag = useCallback((tag: string) => {
      if (isEditDialogOpen && selectedAgent) {
          const currentTags = selectedAgent.personalityTags || [];
          const updatedTags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
          setSelectedAgent(prev => prev ? { ...prev, personalityTags: updatedTags } : null);
      } else {
          const currentTags = newAgent.personalityTags || [];
           const updatedTags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
          setNewAgent(prev => ({ ...prev, personalityTags: updatedTags }));
      }
  }, [isEditDialogOpen, selectedAgent, newAgent.personalityTags]);
  
  // Avatar handling
  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Clear the input value to allow selecting the same file again
      e.target.value = '';
    }
  }, []);
  
  const handleGenerateAvatar = useCallback(async () => {
    if (!selectedAgent && !newAgent.name) return;
    
    setIsGeneratingAvatar(true);
    const prompt = avatarPrompt || `A professional avatar for an AI agent named ${selectedAgent?.name || newAgent.name}`;
    
    try {
      if (isEditDialogOpen && selectedAgent) {
        // Generate avatar for existing agent
        const result = await generateAiAgentAvatar(selectedAgent.id, prompt);
        setSelectedAgent(prev => prev ? { ...prev, avatarUrl: result.avatarUrl, avatarType: 'generated', avatarPrompt: prompt } : null);
        
        toast({
          title: "Avatar Generat",
          description: "Avatar-ul a fost generat cu succes.",
          variant: "default",
        });
      }
      // If we're not in edit mode, we just keep the prompt for when the agent is created
      
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
  const handleUploadAvatar = async () => {
    if (!avatarFile || !selectedAgent) return;
    
    try {
      const result = await uploadAiAgentAvatar(selectedAgent.id, avatarFile);
      setSelectedAgent(prev => prev ? { ...prev, avatarUrl: result.avatarUrl, avatarType: 'uploaded' } : null);
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
  };
  
  // Effect to automatically upload avatar when file is selected and in edit mode
  useEffect(() => {
    if (avatarFile && selectedAgent && isEditDialogOpen) {
      handleUploadAvatar();
    }
  }, [avatarFile, selectedAgent, isEditDialogOpen]);
  
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
  
  // --- Updated Error Handling ---
  if (isErrorAgents) {
    const errorMessage = errorAgents?.message || 'Unknown error';
    const isUsageLimitError = errorMessage.includes('Daily AI usage limit');

    if (isUsageLimitError) {
      // Render custom usage limit error alert
      return (
        <div className="container mx-auto p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Tovarășe! Ați Atins Norma Zilnică!</AlertTitle>
            <AlertDescription className="flex flex-col gap-3 mt-2">
              <p>Entuziasmul în muncă este apreciat, dar resursele trebuie folosite judicios. Limita planului actual a fost atinsă. Te rog sa revii in 24 de ore sau sa optezi pentru un pachet superior.</p>
              <a 
                href="/billing" 
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault(); // Prevent default link behavior
                  navigate('/billing'); // Use wouter navigation
                }} 
                className="w-fit text-blue-600 underline hover:text-blue-800 font-medium"
              >
                Solicită Aprobare Resurse. Vezi Pachete
              </a>
            </AlertDescription>
          </Alert>
        </div>
      );
    } else {
      // Render generic error message for other errors
      return <div className="text-red-500">Eroare la încărcarea agenților: {errorMessage}</div>;
    }
  }
  
  // Loading state
  if (isLoadingAgents) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Se încarcă agenții...</span>
      </div>
    );
  }
  
  // Main render
  return (
    <TooltipProvider>
      <div className="container mx-auto py-8" id="agents-page-container">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" id="agents-header-title">Management Agenți AI</h1>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden md:flex" id="agents-profile-menu">
            <ProfileMenu />
          </div>
        </div>
      </div>
        
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4" id="agent-create-button">
              <PlusCircle className="mr-2 h-4 w-4" /> Creează Agent Nou
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]" id="agent-create-dialog">
          <DialogHeader>
              <DialogTitle>Creează Agent Nou</DialogTitle>
              <DialogDescription>Configurați detaliile pentru noul agent AI.</DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2" id="agent-create-form">
               <AgentFormFields 
                 agentData={newAgent} 
                 setData={wrappedSetNewAgent} 
                 documents={documents} 
                 setDocuments={setDocuments}
                 handleFileChange={handleFileChange}
                 removeFile={removeFile}
                 isEditDialogOpen={false}
                 isLoadingDocuments={false}
                 handleDeleteDocument={() => {}}
                 deleteDocumentMutation={deleteDocumentMutation}
                 personalityOptions={PERSONALITY_TAGS}
                 customTag={customTag}
                 setCustomTag={setCustomTag}
                 handleAddTag={addCustomTag}
                 handleRemoveTag={handleRemoveTag}
                 handleSelectTag={handleSelectTag}
                 avatarFile={avatarFile}
                 setAvatarFile={setAvatarFile}
                 handleAvatarChange={handleAvatarChange}
                 handleGenerateAvatar={handleGenerateAvatar}
                 isGeneratingAvatar={isGeneratingAvatar}
                 avatarPrompt={avatarPrompt}
                 setAvatarPrompt={setAvatarPrompt}
                 // UI Components
                 Label={Label}
                 Input={Input}
                 Textarea={Textarea}
                 Button={Button}
                 Select={Select}
                 SelectTrigger={SelectTrigger}
                 SelectValue={SelectValue}
                 SelectContent={SelectContent}
                 SelectItem={SelectItem}
                 Slider={Slider}
                 Badge={Badge}
                 Tabs={Tabs}
                 TabsList={TabsList}
                 TabsTrigger={TabsTrigger}
                 TabsContent={TabsContent}
                 Checkbox={Checkbox}
                 Upload={Upload}
                 Bot={Bot}
                 Loader2={Loader2}
                 X={X}
                 Trash2={Trash2}
              />
            </div>
          <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsCreateDialogOpen(false)} id="agent-cancel-button">Anulează</Button>
               <Button type="submit" onClick={handleCreateAgent} disabled={createAgentMutation.isPending || !newAgent.name || !newAgent.systemInstruction} id="agent-submit-button">
                 {createAgentMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se creează...</> : "Creează Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open: boolean) => {setIsEditDialogOpen(open); if (!open) setSelectedAgent(null); }}>
          <DialogContent className="sm:max-w-[600px]" id="agent-edit-dialog">
          <DialogHeader>
              <DialogTitle>Modifică Agent: {selectedAgent?.name}</DialogTitle>
              <DialogDescription>Actualizați detaliile agentului AI existent.</DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2" id="agent-edit-form">
          {selectedAgent && (
                 <AgentFormFields 
                   agentData={selectedAgent} 
                   setData={wrappedSetSelectedAgent} 
                   documents={documents}
                   setDocuments={setDocuments}
                   handleFileChange={handleFileChange}
                   removeFile={removeFile}
                   isEditDialogOpen={true}
                   agentDocuments={agentDocuments}
                   isLoadingDocuments={isLoadingDocuments}
                   handleDeleteDocument={handleDeleteDocument}
                   deleteDocumentMutation={deleteDocumentMutation}
                   personalityOptions={PERSONALITY_TAGS}
                   customTag={customTag}
                   setCustomTag={setCustomTag}
                   handleAddTag={addCustomTag}
                   handleRemoveTag={handleRemoveTag}
                   handleSelectTag={handleSelectTag}
                   avatarFile={avatarFile}
                   setAvatarFile={setAvatarFile}
                   handleAvatarChange={handleAvatarChange}
                   handleGenerateAvatar={handleGenerateAvatar}
                   isGeneratingAvatar={isGeneratingAvatar}
                   avatarPrompt={avatarPrompt}
                   setAvatarPrompt={setAvatarPrompt}
                   showSharingOption={true}
                   // UI Components
                   Label={Label}
                   Input={Input}
                   Textarea={Textarea}
                   Button={Button}
                   Select={Select}
                   SelectTrigger={SelectTrigger}
                   SelectValue={SelectValue}
                   SelectContent={SelectContent}
                   SelectItem={SelectItem}
                   Slider={Slider}
                   Badge={Badge}
                   Tabs={Tabs}
                   TabsList={TabsList}
                   TabsTrigger={TabsTrigger}
                   TabsContent={TabsContent}
                   Checkbox={Checkbox}
                   Upload={Upload}
                   Bot={Bot}
                   Loader2={Loader2}
                   X={X}
                   Trash2={Trash2}
                 />
                )}
              </div>
          <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => {setIsEditDialogOpen(false); setSelectedAgent(null);}} id="agent-update-cancel-button">Anulează</Button>
              <Button type="submit" onClick={handleUpdateAgent} disabled={updateAgentMutation.isPending || !selectedAgent?.name || !selectedAgent?.systemInstruction} id="agent-update-button">
                 {updateAgentMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se salvează...</> : "Salvează Modificările"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent id="agent-delete-dialog">
          <AlertDialogHeader>
              <AlertDialogTitle>Confirmare Ștergere</AlertDialogTitle>
            <AlertDialogDescription>
                Sunteți sigur că doriți să ștergeți agentul "{selectedAgent?.name}"? Documentele asociate vor fi șterse din storage și baza de date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedAgent(null)} id="agent-delete-cancel-button">Anulează</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAgent} className="bg-red-600 hover:bg-red-700" disabled={deleteAgentMutation.isPending} id="agent-delete-confirm-button">
                 {deleteAgentMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se șterge...</> : "Șterge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

         {/* Chat Modal */} 
         <AgentChatModal 
           agent={selectedAgentForChat} 
           isOpen={isChatModalOpen} 
           onClose={() => setIsChatModalOpen(false)}
           uiComponents={uiComponents}
           agentService={agentService}
           toastService={toastService}
         />

        {/* Agents Table/List */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Agenți Existenți</CardTitle>
              <CardDescription>Lista agenților AI configurați.</CardDescription>
            </div>
            
            {/* Filter Controls */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="agent-filter-select" className="text-sm">Arată:</Label>
              <Select value={agentFilter} onValueChange={(value: any) => setAgentFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Toți agenții" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toți agenții</SelectItem>
                  <SelectItem value="own">Agenții mei</SelectItem>
                  <SelectItem value="public">Agenți publici</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table id="agents-table">
              <TableHeader id="agents-table-header">
                <TableRow>
                  <TableHead>Nume</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="hidden md:table-cell">Descriere</TableHead>
                  <TableHead className="hidden lg:table-cell">Temperatură</TableHead>
                   <TableHead className="hidden lg:table-cell">Etichete</TableHead>
                   <TableHead className="hidden md:table-cell">Creat La</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody id="agents-table-body">
                {filteredAgents.length > 0 ? filteredAgents.map((agent: AiAgent) => (
                  <TableRow key={agent.id} id={`agent-row-${agent.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          {agent.avatarUrl ? (
                            <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                          ) : (
                            <AvatarFallback>
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{agent.name}</span>
                          {agent.isPublic && (
                            <Badge variant="outline" className="mt-1 text-xs w-fit">Public</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{agent.model}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate" title={agent.description || ''}>
                      {agent.description || '-'}
                    </TableCell>
                     <TableCell className="hidden lg:table-cell">{agent.temperature?.toFixed(1)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                         {agent.personalityTags?.slice(0, 3).map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                         {agent.personalityTags && agent.personalityTags.length > 3 && <Badge variant="outline">+{agent.personalityTags.length - 3}</Badge>}
                      </div>
                    </TableCell>
                     <TableCell className="hidden md:table-cell">{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                         {/* Chat Button */}
                         <Tooltip>
                          <TooltipTrigger asChild>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               onClick={() => handleOpenChat(agent)}
                               id={`agent-chat-button-${agent.id}`}
                             >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Chat</p></TooltipContent>
                        </Tooltip>
                        {/* Only show edit/delete/share for agents the user owns */}
                        {agent.isOwner && (
                          <>
                            {/* Share Toggle Button */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleShareAgent(agent)}
                                  disabled={shareAgentMutation.isPending}
                                  id={`agent-share-button-${agent.id}`}
                                  className={agent.isPublic ? "bg-green-50 hover:bg-green-100 border border-green-200" : ""}
                                  title={agent.isPublic ? "Agent public (click to make private)" : "Agent private (click to share)"}
                                >
                                  {shareAgentMutation.isPending && shareAgentMutation.variables?.id === agent.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    agent.isPublic ? (
                                      <Share2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Share2 className="h-4 w-4 text-gray-400" />
                                    )
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {agent.isPublic ? (
                                  <p className="flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span> 
                                    <strong>PUBLIC</strong> - Click to make private
                                  </p>
                                ) : (
                                  <p className="flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 bg-gray-500 rounded-full"></span> 
                                    <strong>PRIVATE</strong> - Click to share with all
                                  </p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                            
                            {/* Edit Button */}
                            <Tooltip>
                               <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEditAgent(agent)}
                                  id={`agent-edit-button-${agent.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Modifică</p></TooltipContent>
                            </Tooltip>
                            {/* Delete Button */}
                            <Tooltip>
                               <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => { setSelectedAgent(agent); setIsDeleteDialogOpen(true); }}
                                  id={`agent-delete-button-${agent.id}`}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TooltipTrigger>
                               <TooltipContent><p>Șterge</p></TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {agentFilter === 'all' ? 'Niciun agent găsit.' : 
                       agentFilter === 'own' ? 'Nu aveți agenți personali.' : 
                       'Nu există agenți publici disponibili.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default AgentsPage; 