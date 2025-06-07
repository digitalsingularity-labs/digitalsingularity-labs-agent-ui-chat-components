import React from 'react';
import { AgentForm, type AgentFormProps } from './AgentForm';
import { type AiAgent } from '../lib/useAgentManagement';
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

  return (
    <div className="h-full flex flex-col" id="agent-edit-tab">
      {/* Tab Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        <h2 className="text-lg font-semibold">{tabTitle}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <AgentForm
          agentData={agentData}
          showSharingOption={true} // Always show sharing for existing agents
          uiComponents={uiComponents}
          {...formProps}
        />
      </div>

      {/* Tab Footer */}
      <div className="p-4 border-t bg-background/95 backdrop-blur">
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Anulează
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !agentData.name || !agentData.systemInstruction}
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
        </div>
      </div>
    </div>
  );
}; 