import React from 'react';
import { useAgentManagement, type AgentManagementProps, type AiAgent } from '../lib/useAgentManagement';
import { AgentFormModal } from './AgentFormModal';
import { AgentResponsiveLayout } from './AgentResponsiveLayout';

// UI Components interface to match what AgentsPage expects
export interface AgentsSettingsUIComponents {
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
  
  // Chat Modal (already from library)
  AgentChatModal: React.ComponentType<any>;
}

export interface AgentsSettingsProps extends AgentManagementProps {
  // Additional props specific to sidebar settings
  containerWidth: number; // Current width of the sidebar container
  
  // UI Components
  uiComponents: AgentsSettingsUIComponents;
  
  // Optional: Agent selection handler for integration with editor
  onAgentSelect?: (agent: AiAgent) => void;
  
  // Optional: Currently selected agent in editor context
  selectedAgentId?: string;
  
  // Optional: Tab-based editing handler
  onEditAgentInTab?: (agent: AiAgent) => void;
  
  // Optional: Tab-based creation handler for new agents
  onCreateAgentInTab?: () => void;
}

export const AgentsSettings: React.FC<AgentsSettingsProps> = (props) => {
  const {
    containerWidth,
    uiComponents,
    onAgentSelect,
    selectedAgentId,
    onEditAgentInTab,
    onCreateAgentInTab,
    ...agentManagementProps
  } = props;

  const agentManagement = useAgentManagement(agentManagementProps);
  
  const {
    // Data
    agents,
    isLoadingAgents,
    errorAgents,
    agentDocuments,
    isLoadingDocuments,
    
    // Selected agent state
    selectedAgent,
    newAgent,
    
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
    
    // Form states
    documents,
    avatarFile,
    avatarPrompt,
    isGeneratingAvatar,
    customTag,
    agentFilter,
    setAgentFilter,
    
    // Mutations
    createAgentMutation,
    updateAgentMutation,
    deleteAgentMutation,
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
    handleShareAgent,
    wrappedSetSelectedAgent,
    
    // Constants
    PERSONALITY_TAGS
  } = agentManagement;

  const {
    // Used UI Components
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    TooltipProvider,
    Alert,
    AlertDescription,
    AlertTitle,
    Loader2,
    AlertCircle,
    AgentChatModal
  } = uiComponents;

  // Enhanced agent selection handler that integrates with editor
  const handleAgentSelectAndEdit = (agent: AiAgent) => {
    if (onEditAgentInTab) {
      // Use tab-based editing if available
      onEditAgentInTab(agent);
    } else {
      // Fall back to modal-based editing
      handleEditAgent(agent);
    }
    // Don't call onAgentSelect for editing - we want to stay in settings
  };

  // Enhanced create agent handler that integrates with editor
  const handleCreateAgentAction = () => {
    if (onCreateAgentInTab) {
      // Use tab-based creation if available
      onCreateAgentInTab();
    } else {
      // Fall back to modal-based creation
      setIsCreateDialogOpen(true);
    }
  };

  const handleAgentSelectAndChat = (agent: AiAgent) => {
    handleOpenChat(agent);
    onAgentSelect?.(agent); // Only call onAgentSelect for chat to switch to agent tab
  };

  // Error handling for usage limits
  if (errorAgents) {
    const errorMessage = errorAgents?.message || 'Unknown error';
    const isUsageLimitError = errorMessage.includes('Daily AI usage limit');

    if (isUsageLimitError) {
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limită Zilnică Atinsă</AlertTitle>
            <AlertDescription className="text-sm">
              Limita de utilizare AI a fost atinsă. Reveniți în 24 de ore sau actualizați planul.
            </AlertDescription>
          </Alert>
        </div>
      );
    } else {
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Eroare</AlertTitle>
            <AlertDescription className="text-sm">
              Eroare la încărcarea agenților: {errorMessage}
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // Loading state
  if (isLoadingAgents) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm">Se încarcă agenții...</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div 
        className="h-full flex flex-col" 
        id="agents-settings-container"
        data-testid="agents-settings"
        data-component="AgentsSettings"
        data-container-width={containerWidth}
      >
        <AgentResponsiveLayout
          containerWidth={containerWidth}
          agents={agents || []}
          selectedAgentId={selectedAgentId}
          agentFilter={agentFilter}
          onAgentFilterChange={setAgentFilter}
          onCreateAgent={handleCreateAgentAction}
          onEditAgent={handleAgentSelectAndEdit}
          onDeleteAgent={(agent) => {
            agentManagement.setSelectedAgent(agent);
            setIsDeleteDialogOpen(true);
          }}
          onChatWithAgent={handleAgentSelectAndChat}
          onShareAgent={handleShareAgent}
          uiComponents={uiComponents}
          data-testid="responsive-layout"
          data-component="responsive-layout"
        />

        {/* Create Agent Modal */}
        <AgentFormModal
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          title="Creează Agent Nou"
          description="Configurați detaliile pentru noul agent AI."
          agentData={newAgent}
          setAgentData={agentManagement.setNewAgent}
          documents={documents}
          setDocuments={agentManagement.setDocuments}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
          isEditMode={false}
          agentDocuments={null}
          isLoadingDocuments={false}
          handleDeleteDocument={() => {}}
          deleteDocumentMutation={deleteDocumentMutation}
          personalityOptions={PERSONALITY_TAGS}
          customTag={customTag}
          setCustomTag={agentManagement.setCustomTag}
          handleAddTag={addCustomTag}
          handleRemoveTag={handleRemoveTag}
          handleSelectTag={handleSelectTag}
          avatarFile={avatarFile}
          setAvatarFile={agentManagement.setAvatarFile}
          handleAvatarChange={handleAvatarChange}
          handleGenerateAvatar={handleGenerateAvatar}
          isGeneratingAvatar={isGeneratingAvatar}
          avatarPrompt={avatarPrompt}
          setAvatarPrompt={agentManagement.setAvatarPrompt}
          showSharingOption={false}
          onSubmit={handleCreateAgent}
          isSubmitting={createAgentMutation.isPending}
          submitButtonText={createAgentMutation.isPending ? "Se creează..." : "Creează Agent"}
          uiComponents={uiComponents}
          data-testid="create-agent-modal"
          data-component="create-modal"
        />

        {/* Edit Agent Modal */}
        {selectedAgent && (
          <AgentFormModal
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            title={`Modifică Agent: ${selectedAgent.name}`}
            description="Actualizați detaliile agentului AI existent."
            agentData={selectedAgent}
            setAgentData={wrappedSetSelectedAgent}
            documents={documents}
            setDocuments={agentManagement.setDocuments}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            isEditMode={true}
            agentDocuments={agentDocuments}
            isLoadingDocuments={isLoadingDocuments}
            handleDeleteDocument={handleDeleteDocument}
            deleteDocumentMutation={deleteDocumentMutation}
            personalityOptions={PERSONALITY_TAGS}
            customTag={customTag}
            setCustomTag={agentManagement.setCustomTag}
            handleAddTag={addCustomTag}
            handleRemoveTag={handleRemoveTag}
            handleSelectTag={handleSelectTag}
            avatarFile={avatarFile}
            setAvatarFile={agentManagement.setAvatarFile}
            handleAvatarChange={handleAvatarChange}
            handleGenerateAvatar={handleGenerateAvatar}
            isGeneratingAvatar={isGeneratingAvatar}
            avatarPrompt={avatarPrompt}
            setAvatarPrompt={agentManagement.setAvatarPrompt}
            showSharingOption={true}
            onSubmit={handleUpdateAgent}
            isSubmitting={updateAgentMutation.isPending}
            submitButtonText={updateAgentMutation.isPending ? "Se actualizează..." : "Actualizează Agent"}
            uiComponents={uiComponents}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen}
          data-testid="delete-agent-dialog"
          data-component="delete-dialog"
        >
          <AlertDialogContent
            data-testid="delete-dialog-content"
            data-component="delete-dialog-content"
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Șterge Agent</AlertDialogTitle>
              <AlertDialogDescription>
                Ești sigur că vrei să ștergi agentul "{selectedAgent?.name}"? 
                Această acțiune nu poate fi anulată și va șterge toate documentele asociate.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-testid="delete-cancel-button"
                data-component="cancel-button"
                data-action="cancel-delete"
              >Anulează</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAgent}
                className="bg-red-600 hover:bg-red-700"
                data-testid="delete-confirm-button"
                data-component="delete-button"
                data-action="confirm-delete"
                data-state={deleteAgentMutation.isPending ? 'loading' : 'idle'}
              >
                {deleteAgentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se șterge...
                  </>
                ) : (
                  "Șterge Agent"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Chat Modal */}
        {selectedAgentForChat && (
          <AgentChatModal
            isOpen={isChatModalOpen}
            onClose={() => setIsChatModalOpen(false)}
            agent={selectedAgentForChat}
            {...agentManagementProps}
          />
        )}
      </div>
    </TooltipProvider>
  );
}; 