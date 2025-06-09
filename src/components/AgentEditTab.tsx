import React from 'react';
import { AgentForm, type AgentFormProps } from './AgentForm';
import { type AgentsSettingsUIComponents } from './AgentsSettings';

export interface AgentEditTabProps extends Omit<AgentFormProps, 'showSharingOption'> {
  // Tab-specific props
  tabTitle: string;
  onSave: () => void;
  onClose: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  
  // UI Components
  uiComponents: AgentsSettingsUIComponents;
}

export const AgentEditTab: React.FC<AgentEditTabProps> = ({
  tabTitle,
  onSave,
  onClose,
  isSubmitting,
  submitButtonText,
  agentData,
  uiComponents,
  ...formProps
}) => {
  const {
    Button,
    Loader2,
    X
  } = uiComponents;

  const handleSubmit = () => {
    if (!agentData.name || !agentData.systemInstruction) {
      return;
    }
    onSave();
  };

  const agentId = agentData?.id || 'new';
  const agentName = agentData?.name || 'Unnamed Agent';
  const isValidForm = !!(agentData.name && agentData.systemInstruction);

  return (
    <div 
      className="h-full flex flex-col" 
      id="agent-edit-tab"
      data-testid={`agent-edit-tab-${agentId}`}
      data-component="AgentEditTab"
      data-functionality="agent-editing"
      data-agent-id={agentId}
      data-agent-name={agentName}
      data-tab-title={tabTitle}
      data-edit-mode="true"
      data-form-valid={isValidForm}
      data-submitting={isSubmitting}
    >
      {/* Tab Header */}
      <div 
        className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur"
        data-testid={`agent-edit-header-${agentId}`}
        data-component="edit-tab-header"
        data-section="header"
      >
        <h2 
          className="text-lg font-semibold"
          data-testid={`agent-edit-title-${agentId}`}
          data-component="tab-title"
          data-content={tabTitle}
        >
          {tabTitle}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
          data-testid={`agent-edit-close-${agentId}`}
          data-component="close-button"
          data-action="close-tab"
          data-agent-id={agentId}
        >
          <X 
            className="h-4 w-4" 
            data-testid={`agent-edit-close-icon-${agentId}`}
            data-component="close-icon"
          />
        </Button>
      </div>

      {/* Form Content */}
      <div 
        className="flex-1 overflow-y-auto"
        data-testid={`agent-edit-form-container-${agentId}`}
        data-component="form-container"
        data-section="content"
        data-scrollable="true"
      >
        <AgentForm
          agentData={agentData}
          showSharingOption={true} // Always show sharing for existing agents
          uiComponents={uiComponents}
          data-testid={`agent-edit-form-${agentId}`}
          data-component="AgentForm"
          data-functionality="agent-editing"
          data-agent-id={agentId}
          data-edit-mode="true"
          data-sharing-enabled="true"
          {...formProps}
        />
      </div>

      {/* Tab Footer */}
      <div 
        className="p-4 border-t bg-background/95 backdrop-blur"
        data-testid={`agent-edit-footer-${agentId}`}
        data-component="edit-tab-footer"
        data-section="footer"
      >
        <div 
          className="flex justify-end gap-2"
          data-testid={`agent-edit-actions-${agentId}`}
          data-component="action-buttons"
          data-button-count="2"
        >
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid={`agent-edit-cancel-${agentId}`}
            data-component="cancel-button"
            data-action="cancel-edit"
            data-agent-id={agentId}
          >
            Anulează
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !agentData.name || !agentData.systemInstruction}
            data-testid={`agent-edit-save-${agentId}`}
            data-component="save-button"
            data-action="save-agent"
            data-agent-id={agentId}
            data-state={isSubmitting ? 'submitting' : 'idle'}
            data-disabled={!isValidForm}
            data-submit-text={submitButtonText}
          >
            {isSubmitting ? (
              <>
                <Loader2 
                  className="mr-2 h-4 w-4 animate-spin" 
                  data-testid={`agent-edit-save-loader-${agentId}`}
                  data-component="loading-spinner"
                />
                {submitButtonText}
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}; 