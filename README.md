# Agent UI Chat Components

[![npm version](https://badge.fury.io/js/@agentui%2Fchat-components.svg)](https://badge.fury.io/js/@agentui%2Fchat-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A reusable React component library for AI agent chat interfaces with dependency injection architecture.

## 🚀 Features

- **🔌 Dependency Injection**: Bring your own UI components and services
- **📝 TypeScript Support**: Full type safety with comprehensive type definitions  
- **⚡ Streaming Support**: Real-time chat with streaming responses
- **💾 History Management**: Optional chat history with localStorage
- **🎨 Highly Customizable**: Configurable styling and behavior
- **🔄 Framework Agnostic**: Works with any UI component library (shadcn/ui, Chakra UI, Material-UI, etc.)
- **📱 Mobile Friendly**: Responsive design out of the box

## 📦 Installation

```bash
npm install @agentui/chat-components lucide-react
```

## 🎯 Quick Start

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
    const response = await fetch(`/api/agents/${agentId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Handle streaming response
    const reader = response.body?.getReader();
    // ... streaming logic
  },
  getUserAvatar: async () => {
    // Your user avatar fetching logic
    return await fetchUserAvatar();
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

## 📋 API Reference

### AgentChatModal Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `agent` | `AiAgent \| null` | ✅ | The agent to chat with |
| `isOpen` | `boolean` | ✅ | Controls modal visibility |
| `onClose` | `() => void` | ✅ | Called when modal should close |
| `uiComponents` | `UIComponents` | ✅ | Your UI component implementations |
| `agentService` | `AgentService` | ✅ | Your chat service implementation |
| `toastService` | `ToastService` | ❌ | Optional toast notifications |
| `enableHistory` | `boolean` | ❌ | Enable chat history (default: true) |
| `maxMessages` | `number` | ❌ | Max messages to keep (default: 100) |
| `className` | `string` | ❌ | Additional CSS classes |

### Type Definitions

```typescript
interface AiAgent {
  id: string;
  name: string;
  description?: string | null;
  model: string;
  temperature?: number;
  avatarUrl?: string | null;
}

interface AgentService {
  sendMessage(
    message: string,
    agentId: string,
    onChunk: (chunk: string) => void,
    onError: (error: any) => void,
    onCompletion: () => void
  ): Promise<void>;
  
  getUserAvatar?(): Promise<string | null>;
}
```

## 🎨 UI Framework Examples

### shadcn/ui
```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
// ... other imports

const uiComponents = { Dialog, DialogContent, Button, /* ... */ };
```

### Chakra UI
```tsx
import { Modal, ModalContent, Button, Input } from '@chakra-ui/react';

const uiComponents = {
  Dialog: Modal,
  DialogContent: ModalContent,
  Button,
  Input,
  // ... map other components
};
```

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/agent-ui-chat-components.git
cd agent-ui-chat-components

# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) and [TypeScript](https://www.typescriptlang.org/)
- Icons by [Lucide React](https://lucide.dev/)
- Inspired by the need for reusable AI chat interfaces

---

**Made with ❤️ for the AI community!**
