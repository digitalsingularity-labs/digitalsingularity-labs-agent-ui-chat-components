import React from 'react';
import { type AiAgent, type AiAgentDocument } from '../lib/useAgentManagement';
import { type AgentsSettingsUIComponents } from './AgentsSettings';

// Props interface for AgentFormModal
export interface AgentFormModalProps {
  // Modal control
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  
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
  
  // Submit handling
  onSubmit: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  
  // UI Components
  uiComponents: AgentsSettingsUIComponents;
}

export const AgentFormModal: React.FC<AgentFormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
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
  onSubmit,
  isSubmitting,
  submitButtonText,
  uiComponents
}) => {
  const {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
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
    Bot,
    Loader2,
    X,
    Trash2
  } = uiComponents;

  const handleSubmit = () => {
    if (!agentData.name || !agentData.systemInstruction) {
      return;
    }
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-hidden" 
        id="agent-form-modal-content"
        data-testid="agent-form-modal"
        data-component="AgentFormModal"
        data-mode={isEditMode ? 'edit' : 'create'}
      >
        <DialogHeader 
          id="agent-form-modal-header"
          data-testid="form-modal-header"
          data-component="form-header"
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div 
          className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2" 
          id="agent-form-modal-form-container"
          data-testid="form-container"
          data-component="form-fields-container"
        >
          {/* Agent Name */}
          <div 
            className="grid gap-2" 
            id="agent-form-name-section"
            data-testid="agent-name-section"
            data-component="name-field"
          >
            <Label htmlFor="name">Nume Agent</Label>
            <Input 
              id="agent-name-input" 
              value={agentData.name || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAgentData((prev: Partial<AiAgent>) => ({ ...prev, name: e.target.value }));
              }} 
              placeholder="Ex: Asistent Documente Legale"
              data-testid="agent-name-input"
              data-component="name-input"
              data-field="name"
            />
          </div>

          {/* Avatar Section */}
          <div 
            className="grid gap-2" 
            id="agent-form-avatar-section"
            data-testid="avatar-section"
            data-component="avatar-field"
          >
            <Label>Avatar Agent</Label>
            <div 
              className="flex gap-4 items-start" 
              id="agent-form-avatar-container"
              data-testid="avatar-container"
              data-component="avatar-controls"
            >
              {/* Avatar Preview */}
              <div 
                className="w-20 h-20 min-w-20 min-h-20 max-w-20 max-h-20 bg-muted rounded-md overflow-hidden flex items-center justify-center flex-shrink-0"
                data-testid="avatar-preview"
                data-component="avatar-preview"
              >
                {agentData.avatarUrl ? (
                  <img 
                    src={agentData.avatarUrl} 
                    alt={`Avatar for ${agentData.name || 'agent'}`}
                    className="w-full h-full object-cover max-w-20 max-h-20"
                    style={{ maxWidth: '80px', maxHeight: '80px' }}
                  />
                ) : avatarFile ? (
                  <img 
                    src={URL.createObjectURL(avatarFile)} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover max-w-20 max-h-20"
                    style={{ maxWidth: '80px', maxHeight: '80px' }}
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
                      data-testid="avatar-upload-input"
                      data-component="avatar-upload"
                      data-field="avatar-file"
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
                        data-testid="avatar-prompt-input"
                        data-component="avatar-prompt"
                        data-field="avatar-prompt"
                      />
                      <Button 
                        onClick={handleGenerateAvatar} 
                        disabled={isGeneratingAvatar || !agentData.name}
                        variant="outline"
                        size="sm"
                        data-testid="generate-avatar-button"
                        data-component="generate-avatar"
                        data-action="generate-avatar"
                        data-state={isGeneratingAvatar ? 'loading' : 'idle'}
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
              data-testid="agent-description-textarea"
              data-component="description-input"
              data-field="description"
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
              data-testid="system-instruction-textarea"
              data-component="system-instruction-input"
              data-field="system-instruction"
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
              data-testid="model-select"
              data-component="model-selector"
              data-field="model"
            >
              <SelectTrigger
                data-testid="model-select-trigger"
                data-component="select-trigger"
              >
                <SelectValue placeholder="Selectează Model" />
              </SelectTrigger>
              <SelectContent
                data-testid="model-select-content"
                data-component="select-options"
              >
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
              data-testid="temperature-slider"
              data-component="temperature-control"
              data-field="temperature"
            />
            <p className="text-sm text-muted-foreground">
              Controlează caracterul aleatoriu: valori mai mici pentru răspunsuri mai concentrate.
            </p>
          </div>

          {/* Personality Tags */}
          <div className="grid gap-2">
            <Label>Etichete Personalitate (Opțional)</Label>
            <div 
              className="flex flex-wrap gap-2"
              data-testid="personality-tags-container"
              data-component="personality-tags"
            >
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
                data-testid="custom-tag-input"
                data-component="custom-tag-input"
                data-field="custom-tag"
              />
              <Button 
                onClick={handleAddTag} 
                variant="outline" 
                size="sm"
                data-testid="add-tag-button"
                data-component="add-tag"
                data-action="add-tag"
              >
                Adaugă
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {agentData.personalityTags?.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)} 
                  />
                </Badge>
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

            <div 
              className="flex items-center gap-2 mt-2"
              data-testid="document-upload-section"
              data-component="document-upload"
            >
              <Input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                className="text-sm"
                data-testid="document-upload-input"
                data-component="document-input"
                data-field="documents"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formate suportate: .txt, .pdf, .docx. Primii 10.000 de caractere din fiecare document.
            </p>
          </div>

          {/* Sharing toggle - only show for existing agents */}
          {showSharingOption && (
            <div 
              className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20"
              data-testid="sharing-option-section"
              data-component="sharing-controls"
            >
              <Checkbox 
                checked={!!agentData.isPublic}
                onCheckedChange={(checked: boolean) => 
                  setAgentData((prev: Partial<AiAgent>) => ({ ...prev, isPublic: checked === true }))
                }
                data-testid="sharing-checkbox"
                data-component="sharing-toggle"
                data-field="is-public"
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

        <DialogFooter 
          id="agent-form-modal-footer"
          data-testid="form-modal-footer"
          data-component="form-footer"
        >
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            id="agent-form-cancel-btn"
            data-testid="cancel-button"
            data-component="cancel-button"
            data-action="cancel"
          >
            Anulează
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isSubmitting || !agentData.name || !agentData.systemInstruction}
            id="agent-form-submit-btn"
            data-testid="submit-button"
            data-component="submit-button"
            data-action="submit"
            data-state={isSubmitting ? 'loading' : 'idle'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {submitButtonText}
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 