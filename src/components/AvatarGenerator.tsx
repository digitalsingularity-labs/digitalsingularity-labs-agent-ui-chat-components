import React, { useState } from 'react';

export interface AvatarGeneratorProps {
  // Current avatar state
  avatarUrl?: string | null;
  avatarFile?: File | null;
  
  // Agent info for context
  agentName?: string;
  
  // Callbacks
  onAvatarFileChange: (file: File | null) => void;
  onAvatarUrlChange: (url: string | null) => void;
  
  // Avatar generation service
  generateAvatar?: (prompt: string, agentName?: string) => Promise<{ imageUrl: string }>;
  
  // UI Components (dependency injection)
  uiComponents: {
    Input: React.ComponentType<any>;
    Button: React.ComponentType<any>;
    Label: React.ComponentType<any>;
    Tabs: React.ComponentType<any>;
    TabsList: React.ComponentType<any>;
    TabsTrigger: React.ComponentType<any>;
    TabsContent: React.ComponentType<any>;
    Bot: React.ComponentType<any>;
    Loader2: React.ComponentType<any>;
  };
  
  // Toast service
  toastService?: {
    toast: (props: { title: string; description: string; variant?: string }) => void;
  };
  
  // Configuration
  size?: 'sm' | 'md' | 'lg';
  showGenerateTab?: boolean;
  placeholder?: string;
  uploadTabLabel?: string;
  generateTabLabel?: string;
}

export const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({
  avatarUrl,
  avatarFile,
  agentName,
  onAvatarFileChange,
  onAvatarUrlChange,
  generateAvatar,
  uiComponents,
  toastService,
  size = 'md',
  showGenerateTab = true,
  placeholder = "Prompt pentru avatar",
  uploadTabLabel = "Încarcă",
  generateTabLabel = "Generează"
}) => {
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const {
    Input,
    Button,
    Label,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Bot,
    Loader2
  } = uiComponents;

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-12 h-12', icon: 'w-4 h-4' },
    md: { container: 'w-16 h-16', icon: 'w-6 h-6' },
    lg: { container: 'w-20 h-20', icon: 'w-8 h-8' }
  };

  const currentSize = sizeConfig[size];

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onAvatarFileChange(file);
      // Clear the generated URL when uploading a file
      onAvatarUrlChange(null);
    }
  };

  const handleGenerateAvatar = async () => {
    if (!generateAvatar || (!avatarPrompt && !agentName)) return;
    
    setIsGeneratingAvatar(true);
    try {
      const result = await generateAvatar(avatarPrompt, agentName);
      if (result.imageUrl) {
        onAvatarUrlChange(result.imageUrl);
        // Clear any uploaded file when generating
        onAvatarFileChange(null);
        
        toastService?.toast({
          title: "Avatar generat cu succes",
          description: "Avatarul a fost generat și aplicat."
        });
      }
    } catch (error) {
      toastService?.toast({
        title: "Eroare",
        description: "Nu s-a putut genera avatarul.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const getAvatarSrc = () => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    return avatarUrl;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <div className="space-y-2">
      <Label>Avatar Agent</Label>
      <div className="flex gap-4 items-start">
        {/* Avatar Preview */}
        <div className={`${currentSize.container} bg-muted rounded-md overflow-hidden flex items-center justify-center`}>
          {avatarSrc ? (
            <img 
              src={avatarSrc} 
              alt={`Avatar for ${agentName || 'agent'}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Bot className={`${currentSize.icon} text-muted-foreground`} />
          )}
        </div>
        
        {/* Avatar Controls */}
        <div className="flex-1 space-y-2">
          {showGenerateTab ? (
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">{uploadTabLabel}</TabsTrigger>
                <TabsTrigger value="generate">{generateTabLabel}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-2">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarFileChange} 
                  className="text-sm"
                />
                {avatarFile && (
                  <p className="text-xs text-muted-foreground">{avatarFile.name}</p>
                )}
              </TabsContent>
              
              <TabsContent value="generate" className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder={placeholder}
                    value={avatarPrompt} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarPrompt(e.target.value)}
                    className="text-sm"
                  />
                  <Button 
                    onClick={handleGenerateAvatar} 
                    disabled={isGeneratingAvatar || !generateAvatar || (!avatarPrompt && !agentName)}
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
          ) : (
            // Upload only mode
            <div className="space-y-2">
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarFileChange} 
                className="text-sm"
              />
              {avatarFile && (
                <p className="text-xs text-muted-foreground">{avatarFile.name}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarGenerator; 