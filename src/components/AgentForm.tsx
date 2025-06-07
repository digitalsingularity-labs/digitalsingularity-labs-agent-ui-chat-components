import React from 'react';
import { type AiAgent, type AiAgentDocument } from '../lib/useAgentManagement';
import { type AgentsSettingsUIComponents } from './AgentsSettings';

// Props interface for AgentForm
export interface AgentFormProps {
  // Agent data
  agentData: Partial<AiAgent>;
  setAgentData: React.Dispatch<React.SetStateAction<any>>;
  
  // Documents
  documents: File[];
  setDocuments: React.Dispatch<React.SetStateAction<File[]>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  
  // Edit mode vs create mode
  isEditMode: boolean;
  agentDocuments?: AiAgentDocument[] | null;
  isLoadingDocuments: boolean;
  handleDeleteDocument: (documentId: number) => void;
  deleteDocumentMutation: any;
  
  // Personality tags
  personalityOptions: string[];
  customTag: string;
  setCustomTag: React.Dispatch<React.SetStateAction<string>>;
  handleAddTag: () => void;
  handleRemoveTag: (tagToRemove: string) => void;
  handleSelectTag: (tag: string) => void;
  
  // Avatar
  avatarFile?: File | null;
  setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateAvatar: () => void;
  isGeneratingAvatar?: boolean;
  avatarPrompt: string;
  setAvatarPrompt: React.Dispatch<React.SetStateAction<string>>;
  
  // Sharing option
  showSharingOption?: boolean;
  
  // UI Components
  uiComponents: AgentsSettingsUIComponents;
}

export const AgentForm: React.FC<AgentFormProps> = ({
  agentData,
  setAgentData,
  documents,
  handleFileChange,
  removeFile,
  isEditMode,
  agentDocuments,
  isLoadingDocuments,
  handleDeleteDocument,
  deleteDocumentMutation,
  personalityOptions,
  customTag,
  setCustomTag,
  handleAddTag,
  handleRemoveTag,
  handleSelectTag,
  avatarFile,
  handleAvatarChange,
  handleGenerateAvatar,
  isGeneratingAvatar,
  avatarPrompt,
  setAvatarPrompt,
  showSharingOption = false,
  uiComponents
}) => {
  const {
    Label,
    Input,
    Textarea,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Slider,
    Badge,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Checkbox,
    Button,
    Bot,
    Loader2,
    X,
    Trash2
  } = uiComponents;

  return (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2" id="agent-form-container">
      {/* Agent Name */}
      <div className="grid gap-2" id="agent-form-name-section">
        <Label htmlFor="name">Nume Agent</Label>
        <Input 
          id="agent-name-input" 
          value={agentData.name || ''} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, name: e.target.value }));
          }} 
          placeholder="Ex: Asistent Documente Legale"
        />
      </div>

      {/* Avatar Section */}
      <div className="grid gap-2" id="agent-form-avatar-section">
        <Label>Avatar Agent</Label>
        <div className="flex gap-4 items-start" id="agent-form-avatar-container">
          {/* Avatar Preview */}
          <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex items-center justify-center">
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
              <Bot className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          
          {/* Avatar Controls */}
          <div className="flex-1 space-y-2">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Încarcă</TabsTrigger>
                <TabsTrigger value="generate">Generează</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-2">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="text-sm"
                />
                {avatarFile && (
                  <p className="text-xs text-muted-foreground">{avatarFile.name}</p>
                )}
              </TabsContent>
              
              <TabsContent value="generate" className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Prompt pentru avatar"
                    value={avatarPrompt} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarPrompt(e.target.value)}
                    className="text-sm"
                  />
                  <Button 
                    onClick={handleGenerateAvatar} 
                    disabled={isGeneratingAvatar || !agentData.name}
                    variant="outline"
                    size="sm"
                  >
                    {isGeneratingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Generarea poate dura câteva secunde.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <Label htmlFor="description">Descriere (Opțional)</Label>
        <Textarea 
          id="agent-description-textarea" 
          value={agentData.description || ''} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Ex: Ajută la crearea și revizuirea contractelor"
          rows={3}
        />
      </div>

      {/* System Instruction */}
      <div className="grid gap-2">
        <Label htmlFor="systemInstruction">Instrucțiune Sistem</Label>
        <Textarea 
          id="agent-system-instruction-textarea" 
          value={agentData.systemInstruction || ''} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, systemInstruction: e.target.value }))
          } 
          placeholder="Ex: Ești un asistent AI specializat în documente legale..."
          rows={4}
        />
      </div>

      {/* AI Model */}
      <div className="grid gap-2">
        <Label htmlFor="model">Model AI</Label>
        <Select 
          value={agentData.model || 'gpt-4o'} 
          onValueChange={(value: string) => 
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, model: value }))
          }
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

      {/* Temperature */}
      <div className="grid gap-2">
        <Label htmlFor="temperature">
          Temperatură: {agentData.temperature?.toFixed(1) || '0.7'}
        </Label>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[agentData.temperature || 0.7]}
          onValueChange={(value: number[]) => 
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, temperature: value[0] }))
          }
        />
        <p className="text-sm text-muted-foreground">
          Controlează caracterul aleatoriu: valori mai mici pentru răspunsuri mai concentrate.
        </p>
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
              className="cursor-pointer text-xs"
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { 
              if (e.key === 'Enter') { 
                e.preventDefault(); 
                handleAddTag(); 
              } 
            }}
            className="text-sm"
          />
          <Button onClick={handleAddTag} variant="outline" size="sm">
            Adaugă
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {agentData.personalityTags?.map(tag => (
            <div key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 bg-white">
              {tag}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleRemoveTag(tag)} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="grid gap-2">
        <Label htmlFor="documents">Documente Context (Opțional)</Label>
        
        {/* Display uploaded documents only in Edit mode */}
        {isEditMode && agentDocuments && agentDocuments.length > 0 && (
          <div className="mt-2 space-y-2">
            <h4 className="text-sm font-medium">Documente Încărcate:</h4>
            {isLoadingDocuments && (
              <p className="text-sm text-muted-foreground">Se încarcă documentele...</p>
            )}
            <ul className="space-y-1 text-sm">
              {agentDocuments.map((doc: AiAgentDocument) => (
                <li key={doc.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="truncate">
                    {doc.fileName} ({doc.fileSize ? (doc.fileSize / 1024).toFixed(1) : '0'} KB)
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteDocument(doc.id)} 
                    disabled={deleteDocumentMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display staged documents in Create mode */}
        {!isEditMode && documents.length > 0 && (
          <div className="mt-2 space-y-2">
            <h4 className="text-sm font-medium">Documente Pregătite:</h4>
            <ul className="space-y-1 text-sm">
              {documents.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="truncate">{file.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <Input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            className="text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Formate suportate: .txt, .pdf, .docx. Primii 10.000 de caractere din fiecare document.
        </p>
      </div>

      {/* Sharing toggle - only show for existing agents */}
      {showSharingOption && (
        <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
          <Checkbox 
            checked={!!agentData.isPublic}
            onCheckedChange={(checked: boolean) => 
              setAgentData((prev: Partial<AiAgent>) => ({ ...prev, isPublic: checked === true }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label className="text-sm font-medium leading-none flex items-center">
              Partajează cu toți utilizatorii
              {agentData.isPublic && (
                <Badge variant="outline" className="ml-2 text-xs">Public</Badge>
              )}
            </Label>
            <p className="text-xs text-muted-foreground">
              Alți utilizatori vor putea vedea și folosi acest agent AI, dar nu îl vor putea modifica.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 