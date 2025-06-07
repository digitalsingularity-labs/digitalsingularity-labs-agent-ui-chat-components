# Agent UI Components

[![npm version](https://badge.fury.io/js/@digitalsingularity%2Fagent-ui-chat-components.svg)](https://badge.fury.io/js/@digitalsingularity%2Fagent-ui-chat-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A comprehensive React component library for AI agent interfaces with dependency injection architecture.

## 🚀 Features.

- **🤖 Complete Agent Management**: Full CRUD operations for AI agents
- **💬 Chat Interface**: Real-time streaming chat with agents
- **🔌 Dependency Injection**: Bring your own UI components and services
- **📝 TypeScript Support**: Full type safety with comprehensive type definitions  
- **⚡ Streaming Support**: Real-time chat with streaming responses
- **📄 Document Management**: Upload and manage agent context documents
- **🎭 Avatar System**: Upload custom avatars or generate AI-powered ones
- **🏷️ Personality Tags**: Configurable agent personality traits
- **🌡️ Temperature Control**: Fine-tune AI response randomness
- **🔄 Model Selection**: Support for multiple AI models
- **📱 Mobile Friendly**: Responsive design out of the box
- **🎨 Highly Customizable**: Configurable styling and behavior
- **🔄 Framework Agnostic**: Works with any UI component library (shadcn/ui, Chakra UI, Material-UI, etc.)

## 📦 Installation

```bash
npm install @digitalsingularity/agent-ui-chat-components lucide-react
```

## 🎯 Quick Start

### AgentsPage Component

```tsx
import { AgentsPage } from '@digitalsingularity/agent-ui-chat-components';
import { agentsPageServices } from '@/lib/agents-page-services';

function App() {
  return (
    <AgentsPage {...agentsPageServices} />
  );
}
```

### AgentChatModal Component

```tsx
import { 
  AgentChatModal, 
  UIComponents, 
  AgentService 
} from '@digitalsingularity/agent-ui-chat-components';

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

### AgentsPage Props

The `AgentsPage` component requires extensive dependency injection. See the `AgentsPageProps` interface for the complete list of required props including:

- **Navigation**: `useLocation` hook
- **React Query**: `useMutation`, `useQueryClient`, `useQuery`
- **API Functions**: All agent-related API functions
- **UI Components**: Complete set of UI components (60+ components)
- **Icons**: Lucide React icons
- **Services**: Toast, agent, and UI services

```typescript
interface AgentsPageProps {
  // Navigation
  useLocation: () => [string, (path: string) => void];
  
  // React Query
  useMutation: any;
  useQueryClient: any;
  useQuery: any;
  
  // API functions
  useAiAgents: () => any;
  createAiAgent: (agent: any) => Promise<AiAgent>;
  updateAiAgent: (id: string, agentData: any) => Promise<AiAgent>;
  deleteAiAgent: (id: string) => Promise<void>;
  // ... many more API functions
  
  // UI Components (60+ required)
  Card: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  Dialog: React.ComponentType<any>;
  // ... all required UI components
  
  // Icons
  Loader2: React.ComponentType<any>;
  Edit: React.ComponentType<any>;
  // ... all required icons
  
  // Services
  agentService: any;
  toastService: any;
  uiComponents: any;
}
```

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
  systemInstruction: string;
  temperature?: number;
  model: string;
  personalityTags?: string[];
  avatarUrl?: string | null;
  avatarType?: string;
  avatarPrompt?: string;
  isPublic?: boolean;
  isOwner?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AiAgentDocument {
  id: number;
  fileName: string;
  fileSize?: number;
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

## 🧪 Testing & Element Identification

All components include comprehensive identification attributes for automated testing, debugging, and analytics. The library uses a structured approach to element identification:

### Identification Attribute Strategy

#### 1. **`data-testid`** - For Automated Testing
Primary attribute for test automation (Jest, Cypress, Playwright):
```typescript
data-testid="agent-chat-modal"
data-testid="create-agent-button"
data-testid="message-input"
```

#### 2. **`data-component`** - For Component Identification
Identifies the component type or functional role:
```typescript
data-component="AgentChatModal"
data-component="form-input"
data-component="message-bubble"
```

#### 3. **`data-action`** - For User Actions
Identifies interactive elements and their actions:
```typescript
data-action="send-message"
data-action="create-agent"
data-action="delete-agent"
```

#### 4. **`data-state`** - For Element States
Tracks dynamic states of components:
```typescript
data-state="loading"
data-state="disabled"
data-state="selected"
```

#### 5. **`data-field`** - For Form Fields
Identifies form inputs and their purpose:
```typescript
data-field="agent-name"
data-field="system-instruction"
data-field="temperature"
```

### Naming Conventions

#### Test IDs
- **Format**: `{component}-{element}-{modifier?}`
- **Examples**:
  - `agent-chat-modal` - Main chat modal
  - `create-agent-button` - Agent creation button
  - `message-input` - Message input field
  - `agent-row-{id}` - Specific agent row with ID

#### Component Names
- **Format**: `{ComponentName}` or `{functional-role}`
- **Examples**:
  - `AgentChatModal` - Top-level component name
  - `message-avatar` - Functional component role
  - `input-section` - Semantic section name

#### Actions
- **Format**: `{verb}-{noun}` or `{verb}-{target}`
- **Examples**:
  - `send-message` - Send a message
  - `create-agent` - Create new agent
  - `toggle-share` - Toggle sharing state

#### States
- **Format**: `{state}` or `{property}-{value}`
- **Examples**:
  - `loading` - Element is loading
  - `disabled` - Element is disabled
  - `public` - Sharing state is public

### Testing Examples

#### Cypress Tests
```typescript
// Test agent creation
cy.get('[data-testid="create-agent-button"]').click();
cy.get('[data-testid="agent-name-input"]').type('Test Agent');
cy.get('[data-testid="submit-button"]').click();

// Test chat functionality
cy.get('[data-testid="agent-chat-modal"]').should('be.visible');
cy.get('[data-testid="message-input"]').type('Hello!');
cy.get('[data-testid="send-button"]').click();
```

#### Jest/React Testing Library
```typescript
import { render, fireEvent } from '@testing-library/react';

test('creates new agent', () => {
  const { getByTestId } = render(<AgentsPage {...props} />);
  
  fireEvent.click(getByTestId('create-agent-button'));
  fireEvent.change(getByTestId('agent-name-input'), { 
    target: { value: 'Test Agent' } 
  });
  fireEvent.click(getByTestId('submit-button'));
  
  expect(getByTestId('agents-table')).toContainElement(
    getByTestId('agent-row-test-agent')
  );
});
```

#### Playwright Tests
```typescript
// Test responsive layout
await page.locator('[data-testid="agent-layout-compact"]').waitFor();
await page.locator('[data-testid="agent-item-123"]').click();

// Test form interactions
await page.locator('[data-testid="agent-form-modal"]').waitFor();
await page.fill('[data-field="name"]', 'New Agent');
await page.click('[data-action="submit"]');
```

### Debugging & Analytics

#### Debug Element Discovery
```javascript
// Find all interactive elements
document.querySelectorAll('[data-action]');

// Find all form fields
document.querySelectorAll('[data-field]');

// Find elements by component type
document.querySelectorAll('[data-component="message-bubble"]');
```

#### Analytics Integration
```typescript
// Track user interactions
document.addEventListener('click', (e) => {
  const action = e.target.getAttribute('data-action');
  const component = e.target.getAttribute('data-component');
  
  if (action) {
    analytics.track('user_action', {
      action,
      component,
      timestamp: Date.now()
    });
  }
});
```

### Component-Specific Test IDs

#### AgentChatModal
- `agent-chat-modal` - Main modal container
- `chat-messages-area` - Messages scroll area
- `message-input` - Message input field
- `send-message-button` - Send button
- `clear-history-button` - Clear chat history

#### AgentFormModal
- `agent-form-modal` - Main form modal
- `agent-name-input` - Agent name field
- `system-instruction-textarea` - System instruction field
- `temperature-slider` - Temperature control
- `generate-avatar-button` - Avatar generation button

#### AgentsPage
- `agents-page` - Main page container
- `create-agent-button` - Create new agent button
- `agents-table` - Agents data table
- `agent-row-{id}` - Individual agent rows
- `edit-button-{id}` - Edit specific agent
- `delete-button-{id}` - Delete specific agent

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
