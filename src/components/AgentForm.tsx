import React from 'react';
import { type AiAgent, type AiAgentDocument } from '../lib/useAgentManagement';
import { type AgentsSettingsUIComponents } from './AgentsSettings';
import { AvatarGenerator } from './AvatarGenerator';

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
  setAvatarFile,
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

  // Create adapter functions for backward compatibility
  const handleAvatarFileChange = (file: File | null) => {
    if (setAvatarFile) {
      setAvatarFile(file);
    }
  };

  const handleAvatarUrlChange = (url: string | null) => {
    setAgentData((prev: Partial<AiAgent>) => ({ ...prev, avatarUrl: url }));
  };

  // Create avatar generation service adapter
  // Note: AvatarGenerator in edit mode has generation disabled anyway
  const avatarGenerationService = undefined;

  const agentId = agentData?.id || 'new';
  const agentName = agentData?.name || '';
  const mode = isEditMode ? 'editing' : 'creation';
  const functionality = isEditMode ? 'agent-editing' : 'agent-creation';

  return (
    <div 
      className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2" 
      id="agent-form-container"
      data-testid={`agent-form-${agentId}`}
      data-component="AgentForm"
      data-functionality={functionality}
      data-mode={mode}
      data-agent-id={agentId}
      data-agent-name={agentName}
      data-edit-mode={isEditMode}
      data-sharing-option={showSharingOption}
    >
      {/* Agent Name */}
      <div 
        className="grid gap-2" 
        id="agent-form-name-section"
        data-testid={`agent-name-section-${agentId}`}
        data-component="form-section"
        data-field="name"
        data-required="true"
      >
        <Label 
          htmlFor="name"
          data-testid={`agent-name-label-${agentId}`}
          data-component="field-label"
        >
          Nume Agent
        </Label>
        <Input 
          id="agent-name-input" 
          value={agentData.name || ''} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, name: e.target.value }));
          }} 
          placeholder="Ex: Asistent Documente Legale"
          data-testid={`agent-name-input-${agentId}`}
          data-component="text-input"
          data-field="name"
          data-functionality={functionality}
          data-required="true"
        />
      </div>

      {/* Avatar Section - Using AvatarGenerator */}
      <AvatarGenerator
        avatarUrl={agentData.avatarUrl}
        avatarFile={avatarFile}
        agentName={agentData.name}
        onAvatarFileChange={handleAvatarFileChange}
        onAvatarUrlChange={handleAvatarUrlChange}
        generateAvatar={avatarGenerationService}
        uiComponents={{
          Input,
          Button,
          Label,
          Tabs,
          TabsList,
          TabsTrigger,
          TabsContent,
          Bot,
          Loader2
        }}
        size="md"
        showGenerateTab={!isEditMode} // Disable generation in edit mode
        placeholder="Prompt pentru avatar"
        uploadTabLabel="Încarcă"
        generateTabLabel="Generează"
        data-testid={`agent-avatar-generator-${agentId}`}
        data-component="AvatarGenerator"
        data-functionality={functionality}
        data-agent-id={agentId}
        data-edit-mode={isEditMode}
      />

      {/* Description */}
      <div 
        className="grid gap-2"
        data-testid={`agent-description-section-${agentId}`}
        data-component="form-section"
        data-field="description"
        data-optional="true"
      >
        <Label 
          htmlFor="description"
          data-testid={`agent-description-label-${agentId}`}
          data-component="field-label"
        >
          Descriere (Opțional)
        </Label>
        <Textarea 
          id="agent-description-textarea" 
          value={agentData.description || ''} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Ex: Ajută la crearea și revizuirea contractelor"
          rows={3}
          data-testid={`agent-description-textarea-${agentId}`}
          data-component="textarea"
          data-field="description"
          data-functionality={functionality}
          data-optional="true"
        />
      </div>

      {/* System Instruction */}
      <div 
        className="grid gap-2"
        data-testid={`agent-system-instruction-section-${agentId}`}
        data-component="form-section"
        data-field="systemInstruction"
        data-required="true"
      >
        <Label 
          htmlFor="systemInstruction"
          data-testid={`agent-system-instruction-label-${agentId}`}
          data-component="field-label"
        >
          Instrucțiune Sistem
        </Label>
        <Textarea 
          id="agent-system-instruction-textarea" 
          value={agentData.systemInstruction || ''} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, systemInstruction: e.target.value }))
          } 
          placeholder="Ex: Ești un asistent AI specializat în documente legale..."
          rows={4}
          data-testid={`agent-system-instruction-textarea-${agentId}`}
          data-component="textarea"
          data-field="systemInstruction"
          data-functionality={functionality}
          data-required="true"
        />
      </div>

      {/* AI Model */}
      <div 
        className="grid gap-2"
        data-testid={`agent-model-section-${agentId}`}
        data-component="form-section"
        data-field="model"
        data-required="true"
      >
        <Label 
          htmlFor="model"
          data-testid={`agent-model-label-${agentId}`}
          data-component="field-label"
        >
          Model AI
        </Label>
        <Select 
          value={agentData.model || 'gpt-4o'} 
          onValueChange={(value: string) => 
            setAgentData((prev: Partial<AiAgent>) => ({ ...prev, model: value }))
          }
          data-testid={`agent-model-select-${agentId}`}
          data-component="select"
          data-field="model"
          data-functionality={functionality}
          data-current-value={agentData.model || 'gpt-4o'}
        >
          <SelectTrigger
            data-testid={`agent-model-trigger-${agentId}`}
            data-component="select-trigger"
          >
            <SelectValue 
              placeholder="Selectează Model"
              data-testid={`agent-model-value-${agentId}`}
              data-component="select-value"
            />
          </SelectTrigger>
          <SelectContent
            data-testid={`agent-model-content-${agentId}`}
            data-component="select-content"
          >
            <SelectItem 
              value="gpt-4o"
              data-testid={`agent-model-option-gpt-4o-${agentId}`}
              data-component="select-option"
              data-model="gpt-4o"
            >
              GPT-4o (Recomandat)
            </SelectItem>
            <SelectItem 
              value="gpt-4-turbo"
              data-testid={`agent-model-option-gpt-4-turbo-${agentId}`}
              data-component="select-option"
              data-model="gpt-4-turbo"
            >
              GPT-4 Turbo
            </SelectItem>
            <SelectItem 
              value="gpt-4"
              data-testid={`agent-model-option-gpt-4-${agentId}`}
              data-component="select-option"
              data-model="gpt-4"
            >
              GPT-4
            </SelectItem>
            <SelectItem 
              value="gpt-3.5-turbo"
              data-testid={`agent-model-option-gpt-3.5-turbo-${agentId}`}
              data-component="select-option"
              data-model="gpt-3.5-turbo"
            >
              GPT-3.5 Turbo
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Temperature */}
      <div 
        className="grid gap-2"
        data-testid={`agent-temperature-section-${agentId}`}
        data-component="form-section"
        data-field="temperature"
        data-type="range"
      >
        <Label 
          htmlFor="temperature"
          data-testid={`agent-temperature-label-${agentId}`}
          data-component="field-label"
          data-current-value={agentData.temperature?.toFixed(1) || '0.7'}
        >
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
          data-testid={`agent-temperature-slider-${agentId}`}
          data-component="range-slider"
          data-field="temperature"
          data-functionality={functionality}
          data-min="0"
          data-max="1"
          data-step="0.1"
          data-current-value={agentData.temperature || 0.7}
        />
        <p 
          className="text-sm text-muted-foreground"
          data-testid={`agent-temperature-help-${agentId}`}
          data-component="help-text"
        >
          Controlează caracterul aleatoriu: valori mai mici pentru răspunsuri mai concentrate.
        </p>
      </div>

      {/* Personality Tags */}
      <div 
        className="grid gap-2"
        data-testid={`agent-personality-section-${agentId}`}
        data-component="form-section"
        data-field="personalityTags"
        data-optional="true"
        data-type="tags"
      >
        <Label
          data-testid={`agent-personality-label-${agentId}`}
          data-component="field-label"
        >
          Etichete Personalitate (Opțional)
        </Label>
        <div 
          className="flex flex-wrap gap-2"
          data-testid={`agent-personality-options-${agentId}`}
          data-component="tag-options"
          data-count={personalityOptions.length}
        >
          {personalityOptions.map(tag => (
            <Badge 
              key={tag} 
              variant={agentData.personalityTags?.includes(tag) ? "default" : "secondary"}
              onClick={() => handleSelectTag(tag)}
              className="cursor-pointer text-xs"
              data-testid={`agent-personality-tag-${tag.toLowerCase().replace(/\s+/g, '-')}-${agentId}`}
              data-component="personality-tag"
              data-tag={tag}
              data-selected={agentData.personalityTags?.includes(tag)}
              data-functionality={functionality}
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div 
          className="flex gap-2 mt-2"
          data-testid={`agent-custom-tag-input-${agentId}`}
          data-component="custom-tag-input"
        >
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
            data-testid={`agent-custom-tag-field-${agentId}`}
            data-component="text-input"
            data-field="customTag"
            data-functionality={functionality}
          />
          <Button 
            onClick={handleAddTag} 
            variant="outline" 
            size="sm"
            data-testid={`agent-add-tag-button-${agentId}`}
            data-component="add-tag-button"
            data-action="add-custom-tag"
            data-functionality={functionality}
          >
            Adaugă
          </Button>
        </div>
        <div 
          className="flex flex-wrap gap-1 mt-1"
          data-testid={`agent-selected-tags-${agentId}`}
          data-component="selected-tags"
          data-count={agentData.personalityTags?.length || 0}
        >
          {agentData.personalityTags?.map(tag => (
            <div 
              key={tag} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 bg-white"
              data-testid={`agent-selected-tag-${tag.toLowerCase().replace(/\s+/g, '-')}-${agentId}`}
              data-component="selected-tag"
              data-tag={tag}
            >
              {tag}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleRemoveTag(tag)}
                data-testid={`agent-remove-tag-${tag.toLowerCase().replace(/\s+/g, '-')}-${agentId}`}
                data-component="remove-tag-button"
                data-action="remove-tag"
                data-tag={tag}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Document Upload Section */}
      <div 
        className="grid gap-2"
        data-testid={`agent-documents-section-${agentId}`}
        data-component="form-section"
        data-field="documents"
        data-optional="true"
        data-type="file-upload"
        data-edit-mode={isEditMode}
      >
        <Label 
          htmlFor="documents"
          data-testid={`agent-documents-label-${agentId}`}
          data-component="field-label"
        >
          Documente Context (Opțional)
        </Label>
        
        {/* Display uploaded documents only in Edit mode */}
        {isEditMode && agentDocuments && agentDocuments.length > 0 && (
          <div 
            className="mt-2 space-y-2"
            data-testid={`agent-uploaded-documents-${agentId}`}
            data-component="uploaded-documents"
            data-count={agentDocuments.length}
            data-loading={isLoadingDocuments}
          >
            <h4 
              className="text-sm font-medium"
              data-testid={`agent-uploaded-documents-title-${agentId}`}
              data-component="section-title"
            >
              Documente Încărcate:
            </h4>
            {isLoadingDocuments && (
              <p 
                className="text-sm text-muted-foreground"
                data-testid={`agent-documents-loading-${agentId}`}
                data-component="loading-text"
              >
                Se încarcă documentele...
              </p>
            )}
            <ul 
              className="space-y-1 text-sm"
              data-testid={`agent-documents-list-${agentId}`}
              data-component="documents-list"
              data-count={agentDocuments.length}
            >
              {agentDocuments.map((doc: AiAgentDocument) => (
                <li 
                  key={doc.id} 
                  className="flex items-center justify-between p-2 bg-muted rounded"
                  data-testid={`agent-document-item-${doc.id}-${agentId}`}
                  data-component="document-item"
                  data-document-id={doc.id}
                  data-file-name={doc.fileName}
                  data-file-size={doc.fileSize}
                >
                  <span 
                    className="truncate"
                    data-testid={`agent-document-name-${doc.id}-${agentId}`}
                    data-component="document-name"
                  >
                    {doc.fileName} ({doc.fileSize ? (doc.fileSize / 1024).toFixed(1) : '0'} KB)
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteDocument(doc.id)} 
                    disabled={deleteDocumentMutation.isPending}
                    data-testid={`agent-delete-document-${doc.id}-${agentId}`}
                    data-component="delete-document-button"
                    data-action="delete-document"
                    data-document-id={doc.id}
                    data-state={deleteDocumentMutation.isPending ? 'pending' : 'idle'}
                  >
                    <Trash2 
                      className="h-4 w-4 text-red-500"
                      data-testid={`agent-delete-document-icon-${doc.id}-${agentId}`}
                      data-component="delete-icon"
                    />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display staged documents in Create mode */}
        {!isEditMode && documents.length > 0 && (
          <div 
            className="mt-2 space-y-2"
            data-testid={`agent-staged-documents-${agentId}`}
            data-component="staged-documents"
            data-count={documents.length}
          >
            <h4 
              className="text-sm font-medium"
              data-testid={`agent-staged-documents-title-${agentId}`}
              data-component="section-title"
            >
              Documente Pregătite:
            </h4>
            <ul 
              className="space-y-1 text-sm"
              data-testid={`agent-staged-documents-list-${agentId}`}
              data-component="staged-documents-list"
              data-count={documents.length}
            >
              {documents.map((file, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-muted rounded"
                  data-testid={`agent-staged-document-${index}-${agentId}`}
                  data-component="staged-document-item"
                  data-file-index={index}
                  data-file-name={file.name}
                >
                  <span 
                    className="truncate"
                    data-testid={`agent-staged-document-name-${index}-${agentId}`}
                    data-component="staged-document-name"
                  >
                    {file.name}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile(index)}
                    data-testid={`agent-remove-staged-document-${index}-${agentId}`}
                    data-component="remove-staged-document-button"
                    data-action="remove-staged-document"
                    data-file-index={index}
                  >
                    <X 
                      className="h-4 w-4 text-red-500"
                      data-testid={`agent-remove-staged-document-icon-${index}-${agentId}`}
                      data-component="remove-icon"
                    />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div 
          className="flex items-center gap-2 mt-2"
          data-testid={`agent-file-upload-container-${agentId}`}
          data-component="file-upload-container"
        >
          <Input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            className="text-sm"
            data-testid={`agent-file-upload-input-${agentId}`}
            data-component="file-input"
            data-field="documents"
            data-functionality={functionality}
            data-multiple="true"
          />
        </div>
        <p 
          className="text-xs text-muted-foreground"
          data-testid={`agent-file-upload-help-${agentId}`}
          data-component="help-text"
        >
          Formate suportate: .txt, .pdf, .docx. Primii 10.000 de caractere din fiecare document.
        </p>
      </div>

      {/* Sharing toggle - only show for existing agents */}
      {showSharingOption && (
        <div 
          className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20"
          data-testid={`agent-sharing-section-${agentId}`}
          data-component="form-section"
          data-field="isPublic"
          data-type="sharing"
          data-edit-mode={isEditMode}
        >
          <Checkbox 
            checked={!!agentData.isPublic}
            onCheckedChange={(checked: boolean) => 
              setAgentData((prev: Partial<AiAgent>) => ({ ...prev, isPublic: checked === true }))
            }
            data-testid={`agent-sharing-checkbox-${agentId}`}
            data-component="sharing-checkbox"
            data-field="isPublic"
            data-functionality={functionality}
            data-current-value={!!agentData.isPublic}
          />
          <div 
            className="grid gap-1.5 leading-none"
            data-testid={`agent-sharing-content-${agentId}`}
            data-component="sharing-content"
          >
            <Label 
              className="text-sm font-medium leading-none flex items-center"
              data-testid={`agent-sharing-label-${agentId}`}
              data-component="sharing-label"
            >
              Partajează cu toți utilizatorii
              {agentData.isPublic && (
                <Badge 
                  variant="outline" 
                  className="ml-2 text-xs"
                  data-testid={`agent-public-badge-${agentId}`}
                  data-component="public-badge"
                  data-status="public"
                >
                  Public
                </Badge>
              )}
            </Label>
            <p 
              className="text-xs text-muted-foreground"
              data-testid={`agent-sharing-help-${agentId}`}
              data-component="help-text"
            >
              Alți utilizatori vor putea vedea și folosi acest agent AI, dar nu îl vor putea modifica.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 