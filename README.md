# Agent UI Chat Components

A reusable React component library for AI agent chat interfaces with dependency injection architecture.

## 🚀 Features

- **Dependency Injection**: Bring your own UI components and services
- **TypeScript Support**: Full type safety with comprehensive type definitions  
- **Streaming Support**: Real-time chat with streaming responses
- **History Management**: Optional chat history with localStorage
- **Highly Customizable**: Configurable styling and behavior
- **Framework Agnostic**: Works with any UI component library

## 📦 Installation

```bash
npm install @agentui/chat-components lucide-react
```

## 🎯 Basic Usage

```tsx
import { 
  AgentChatModal, 
  UIComponents, 
  AgentService 
} from '@agentui/chat-components';

// Import your UI components (example with shadcn/ui)
import { Dialog, DialogContent, Button, Input, /* ... */ } from '@/components/ui';

// Define UI components interface
const uiComponents: UIComponents = {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, Button, Input, ScrollArea,
  Avatar, AvatarFallback, AvatarImage
};

// Define your agent service
const agentService: AgentService = {
  sendMessage: async (message, agentId, onChunk, onError, onCompletion) => {
    // Your streaming chat implementation
  },
  getUserAvatar: async () => {
    // Your user avatar fetching logic
    return avatarUrl;
  }
};

// Use the component
function MyApp() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <AgentChatModal
      agent={selectedAgent}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      uiComponents={uiComponents}
      agentService={agentService}
      toastService={{ toast }}
      enableHistory={true}
      maxMessages={100}
    />
  );
}
```

## 📚 Documentation

See the [full documentation](https://github.com/yourusername/agent-ui-library#readme) for complete API reference and examples.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see LICENSE file for details.
