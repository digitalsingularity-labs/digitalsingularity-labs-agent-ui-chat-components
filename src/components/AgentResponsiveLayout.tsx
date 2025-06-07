import React, { useMemo } from 'react';
import { type AiAgent } from '../lib/useAgentManagement';
import { type AgentsSettingsUIComponents } from './AgentsSettings';

export interface AgentResponsiveLayoutProps {
  containerWidth: number;
  agents: AiAgent[];
  selectedAgentId?: string;
  agentFilter: 'all' | 'own' | 'public';
  onAgentFilterChange: (filter: 'all' | 'own' | 'public') => void;
  onCreateAgent: () => void;
  onEditAgent: (agent: AiAgent) => void;
  onDeleteAgent: (agent: AiAgent) => void;
  onChatWithAgent: (agent: AiAgent) => void;
  onShareAgent: (agent: AiAgent) => void;
  uiComponents: AgentsSettingsUIComponents;
}

// Responsive breakpoints for layout adaptation
const BREAKPOINTS = {
  COMPACT: 250,     // < 250px: Ultra compact - minimal info
  NARROW: 350,      // 250-350px: Narrow - basic cards
  MEDIUM: 500,      // 350-500px: Medium - enhanced cards
  WIDE: 650,        // 500-650px: Wide - full features
  FULL: 800         // > 650px: Full - table or grid view
} as const;

type LayoutMode = 'compact' | 'narrow' | 'medium' | 'wide' | 'full';

export const AgentResponsiveLayout: React.FC<AgentResponsiveLayoutProps> = ({
  containerWidth,
  agents,
  selectedAgentId,
  agentFilter,
  onAgentFilterChange,
  onCreateAgent,
  onEditAgent,
  onDeleteAgent,
  onChatWithAgent,
  onShareAgent,
  uiComponents
}) => {
  const {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Badge,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    Avatar,
    AvatarImage,
    AvatarFallback,
    Edit,
    Trash2,
    MessageSquare,
    Share2,
    PlusCircle,
    Bot,
    Globe
  } = uiComponents;

  // Determine layout mode based on container width
  const layoutMode: LayoutMode = useMemo(() => {
    if (containerWidth < BREAKPOINTS.COMPACT) return 'compact';
    if (containerWidth < BREAKPOINTS.NARROW) return 'narrow';
    if (containerWidth < BREAKPOINTS.MEDIUM) return 'medium';
    if (containerWidth < BREAKPOINTS.WIDE) return 'wide';
    return 'full';
  }, [containerWidth]);

  // Filter counts for display
  const filterCounts = useMemo(() => {
    const allAgents = agents;
    return {
      all: allAgents.length,
      own: allAgents.filter(agent => agent.isOwner).length,
      public: allAgents.filter(agent => agent.isPublic && !agent.isOwner).length
    };
  }, [agents]);

  // Compact Layout (< 250px) - Ultra minimal
  if (layoutMode === 'compact') {
    return (
      <div 
        className="h-full flex flex-col" 
        id="agent-responsive-layout-compact"
        data-testid="agent-layout-compact"
        data-component="AgentResponsiveLayout"
        data-layout-mode="compact"
        data-container-width={containerWidth}
      >
        {/* Compact Header */}
        <div 
          className="p-2 border-b"
          data-testid="compact-header"
          data-component="layout-header"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onCreateAgent} 
                size="sm" 
                className="w-full"
                data-testid="create-agent-button-compact"
                data-component="create-button"
                data-action="create-agent"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Creează Agent Nou</TooltipContent>
          </Tooltip>
        </div>

        {/* Compact Agent List */}
        <div 
          className="flex-1 overflow-y-auto p-1 space-y-1"
          data-testid="compact-agent-list"
          data-component="agent-list"
        >
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`p-2 rounded border cursor-pointer hover:bg-muted transition-colors ${
                selectedAgentId === agent.id ? 'bg-primary/10 border-primary' : ''
              }`}
              onClick={() => onChatWithAgent(agent)}
              data-testid={`agent-item-${agent.id}`}
              data-component="agent-item"
              data-agent-id={agent.id}
              data-selected={selectedAgentId === agent.id}
            >
              <div className="flex items-center gap-2">
                <Avatar 
                  className="h-6 w-6"
                  data-testid={`agent-avatar-${agent.id}`}
                  data-component="agent-avatar"
                >
                  {agent.avatarUrl ? (
                    <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                  ) : (
                    <AvatarFallback>
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{agent.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Narrow Layout (250-350px) - Basic cards
  if (layoutMode === 'narrow') {
    return (
      <div 
        className="h-full flex flex-col" 
        id="agent-responsive-layout-narrow"
        data-testid="agent-layout-narrow"
        data-component="AgentResponsiveLayout"
        data-layout-mode="narrow"
        data-container-width={containerWidth}
      >
        {/* Narrow Header */}
        <div 
          className="p-3 border-b space-y-2"
          data-testid="narrow-header"
          data-component="layout-header"
        >
          <Button 
            onClick={onCreateAgent} 
            size="sm" 
            className="w-full"
            data-testid="create-agent-button-narrow"
            data-component="create-button"
            data-action="create-agent"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nou Agent
          </Button>
          
          <Select 
            value={agentFilter} 
            onValueChange={onAgentFilterChange}
            data-testid="agent-filter-select-narrow"
            data-component="filter-selector"
          >
            <SelectTrigger 
              className="h-8"
              data-testid="filter-select-trigger"
              data-component="select-trigger"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toți ({filterCounts.all})</SelectItem>
              <SelectItem value="own">Proprii ({filterCounts.own})</SelectItem>
              <SelectItem value="public">Publici ({filterCounts.public})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Narrow Agent List */}
        <div 
          className="flex-1 overflow-y-auto p-2 space-y-2"
          data-testid="narrow-agent-list"
          data-component="agent-list"
        >
          {agents.map((agent) => (
            <Card 
              key={agent.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedAgentId === agent.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    {agent.avatarUrl ? (
                      <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                    ) : (
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium truncate">{agent.name}</h4>
                    {agent.description && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {agent.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1 mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onChatWithAgent(agent);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Chat</TooltipContent>
                  </Tooltip>
                  
                  {agent.isOwner && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              onEditAgent(agent);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editează</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              onDeleteAgent(agent);
                            }}
                            className="h-7 w-7 p-0 text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Șterge</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Medium Layout (350-500px) - Enhanced cards
  if (layoutMode === 'medium') {
    return (
      <div 
        className="h-full flex flex-col" 
        id="agent-responsive-layout-medium"
        data-testid="agent-layout-medium"
        data-component="AgentResponsiveLayout"
        data-layout-mode="medium"
        data-container-width={containerWidth}
      >
        {/* Medium Header */}
        <div 
          className="p-4 border-b space-y-3"
          data-testid="medium-header"
          data-component="layout-header"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Agenți AI</h3>
          </div>
          
          <Button 
            onClick={onCreateAgent} 
            className="w-full"
            data-testid="create-agent-button-medium"
            data-component="create-button"
            data-action="create-agent"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Creează Agent Nou
          </Button>
          
          <Select 
            value={agentFilter} 
            onValueChange={onAgentFilterChange}
            data-testid="agent-filter-select-medium"
            data-component="filter-selector"
          >
            <SelectTrigger
              data-testid="filter-select-trigger-medium"
              data-component="select-trigger"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toți Agenții ({filterCounts.all})</SelectItem>
              <SelectItem value="own">Agenții Mei ({filterCounts.own})</SelectItem>
              <SelectItem value="public">Agenți Publici ({filterCounts.public})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Medium Agent List */}
        <div 
          className="flex-1 overflow-y-auto p-3 space-y-3"
          data-testid="medium-agent-list"
          data-component="agent-list"
        >
          {agents.map((agent) => (
            <Card 
              key={agent.id} 
              className={`hover:shadow-md transition-shadow ${
                selectedAgentId === agent.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    {agent.avatarUrl ? (
                      <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                    ) : (
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base truncate">{agent.name}</CardTitle>
                    {agent.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {agent.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {agent.model}
                      </Badge>
                      {agent.isPublic && (
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => onChatWithAgent(agent)}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  
                  {agent.isOwner && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onEditAgent(agent)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onShareAgent(agent)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onDeleteAgent(agent)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Wide Layout (500-650px) and Full Layout (>650px) - Full featured
  return (
    <div 
      className="h-full flex flex-col" 
      id="agent-responsive-layout-wide"
      data-testid="agent-layout-wide"
      data-component="AgentResponsiveLayout"
      data-layout-mode={layoutMode}
      data-container-width={containerWidth}
    >
      {/* Wide/Full Header */}
      <div 
        className="p-4 border-b space-y-4"
        data-testid="wide-header"
        data-component="layout-header"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Management Agenți AI</h3>
        </div>
        
        <div 
          className="flex gap-3"
          data-testid="wide-action-buttons"
          data-component="action-section"
        >
          <Button 
            onClick={onCreateAgent} 
            className="flex-1"
            data-testid="create-agent-button-wide"
            data-component="create-button"
            data-action="create-agent"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Creează Agent Nou
          </Button>
        </div>
        
        <Select 
          value={agentFilter} 
          onValueChange={onAgentFilterChange}
          data-testid="agent-filter-select-wide"
          data-component="filter-selector"
        >
          <SelectTrigger
            data-testid="filter-select-trigger-wide"
            data-component="select-trigger"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toți Agenții ({filterCounts.all})</SelectItem>
            <SelectItem value="own">Agenții Mei ({filterCounts.own})</SelectItem>
            <SelectItem value="public">Agenți Publici ({filterCounts.public})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Wide/Full Agent List - Enhanced Cards */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        data-testid="wide-agent-list"
        data-component="agent-list"
      >
        <div className={`grid gap-4 ${layoutMode === 'full' ? 'grid-cols-1' : 'grid-cols-1'}`}>
          {agents.map((agent) => (
            <Card 
              key={agent.id} 
              className={`hover:shadow-lg transition-all duration-200 ${
                selectedAgentId === agent.id ? 'ring-2 ring-primary shadow-md' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    {agent.avatarUrl ? (
                      <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                    ) : (
                      <AvatarFallback>
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    {agent.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2">
                        {agent.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline">
                        {agent.model}
                      </Badge>
                      <Badge variant="outline">
                        Temp: {agent.temperature?.toFixed(1) || '0.7'}
                      </Badge>
                      {agent.isPublic && (
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      )}
                      {agent.personalityTags?.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {agent.personalityTags && agent.personalityTags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{agent.personalityTags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onChatWithAgent(agent)}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Deschide Chat
                  </Button>
                  
                  {agent.isOwner && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => onEditAgent(agent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editează Agent</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => onShareAgent(agent)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Partajează/Ascunde Agent</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => onDeleteAgent(agent)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Șterge Agent</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}; 