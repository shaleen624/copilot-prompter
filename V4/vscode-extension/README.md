# Copilot Prompter VS Code Extension

A powerful VS Code extension that integrates your Copilot Prompter app directly into VS Code with GitHub Copilot Chat support.

## 🌟 Features

### 🤖 GitHub Copilot Chat Integration
- **Custom Chat Participant**: Use `@copilot-prompter` in GitHub Copilot Chat
- **Slash Commands**: Quick access with `/prompt`, `/template`, `/search`, `/backend`
- **Interactive Responses**: Click buttons to copy or insert prompts directly
- **Smart Search**: Find prompts and templates with natural language

### 📝 Prompt Management
- **Browse Prompts**: Explore your prompt library in the sidebar
- **Quick Search**: Find prompts by title, description, or tags
- **Copy to Clipboard**: One-click copying of prompt text
- **Insert in Chat**: Direct insertion into Copilot Chat conversations

### 🎯 Template Management
- **Browse Templates**: Access copilot instruction templates
- **Create Instructions**: Generate `copilot-instructions.md` files automatically
- **Framework Icons**: Visual identification by framework/language
- **Category Organization**: Organized by project type and framework

### 🔧 Backend Integration
- **Dual Backend Support**: Switch between Node.js and Java backends
- **Authentication**: Secure JWT-based authentication
- **Auto-sync**: Real-time synchronization with your backend
- **Health Monitoring**: Backend connectivity status

## 🚀 Quick Start

### Installation

1. **Install Dependencies**:
   ```bash
   cd vscode-extension
   npm install
   ```

2. **Build Extension**:
   ```bash
   npm run compile
   ```

3. **Install in VS Code**:
   - Press `F5` to launch a new Extension Development Host
   - Or package and install: `vsce package && code --install-extension *.vsix`

### Configuration

1. **Open VS Code Settings** (`Ctrl+,`)
2. **Search for "Copilot Prompter"**
3. **Configure your backend**:
   - **Backend**: Choose `node` or `java`
   - **Node.js URL**: `http://localhost:8181` (default)
   - **Java URL**: `http://localhost:8080` (default)

### Authentication

1. **Open Command Palette** (`Ctrl+Shift+P`)
2. **Run**: `Copilot Prompter: Authenticate`
3. **Choose**:
   - **Demo User** (Node.js): `demo / Demo1234`
   - **Admin** (Java): `admin / admin123`
   - **Custom Login**: Enter your credentials

## 📋 Usage Guide

### GitHub Copilot Chat Commands

#### Basic Usage
```
@copilot-prompter /help
@copilot-prompter /search angular testing
@copilot-prompter /prompt react component
@copilot-prompter /template microservice
```

#### Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/prompt` | Browse prompts | `@copilot-prompter /prompt` |
| `/prompt <query>` | Search prompts | `@copilot-prompter /prompt angular` |
| `/template` | Browse templates | `@copilot-prompter /template` |
| `/template <query>` | Search templates | `@copilot-prompter /template react` |
| `/search <query>` | Search both | `@copilot-prompter /search testing` |
| `/backend` | Show current backend | `@copilot-prompter /backend` |
| `/backend switch` | Switch backend | `@copilot-prompter /backend switch` |
| `/auth` | Authenticate | `@copilot-prompter /auth` |
| `/help` | Show help | `@copilot-prompter /help` |

### Sidebar Integration

1. **Open Copilot Prompter Panel** (Activity Bar)
2. **Browse Categories**:
   - **Prompts**: Organized by category/language
   - **Templates**: Grouped by framework/type
   - **Settings**: Configuration options

3. **Click Items** to:
   - View detailed information
   - Copy to clipboard
   - Insert into chat
   - Create copilot-instructions.md

### Command Palette

- `Copilot Prompter: Authenticate`
- `Copilot Prompter: Search Prompts`
- `Copilot Prompter: Switch Backend`
- `Copilot Prompter: Open Prompts Gallery`
- `Copilot Prompter: Open Templates Gallery`

## 🎯 Example Workflows

### 1. Finding Testing Prompts
```
@copilot-prompter /search unit testing angular
```
→ Shows relevant prompts and templates for Angular unit testing

### 2. Creating Copilot Instructions
```
@copilot-prompter /template microservice architecture
```
→ Find template → Click "Create copilot-instructions.md"

### 3. Quick Backend Switch
```
@copilot-prompter /backend switch
```
→ Instantly switch between Node.js and Java backends

### 4. Searching and Using Prompts
1. `@copilot-prompter /prompt react hooks`
2. Click "📋 Copy to Clipboard" on desired prompt
3. Paste into your Copilot conversation

## ⚙️ Configuration Options

### Backend Settings
```json
{
  "copilot-prompter.backend": "node",
  "copilot-prompter.nodeUrl": "http://localhost:8181",
  "copilot-prompter.javaUrl": "http://localhost:8080",
  "copilot-prompter.autoAuth": false
}
```

### Workspace Settings
Add to your `.vscode/settings.json`:
```json
{
  "copilot-prompter.backend": "node",
  "copilot-prompter.autoAuth": true
}
```

## 🔧 Development

### Building
```bash
npm run compile      # Compile TypeScript
npm run watch        # Watch mode
npm run package      # Create production build
```

### Testing
```bash
npm run test         # Run tests
npm run lint         # Check code style
```

### Debugging
1. Open in VS Code
2. Press `F5` to launch Extension Development Host
3. Set breakpoints in TypeScript files
4. Test functionality in the new window

## 🤝 Integration Points

### With Copilot Prompter App
- **API Compatibility**: Works with both Node.js and Java backends
- **Authentication**: Shares JWT tokens with web app
- **Real-time Sync**: Changes reflect immediately
- **Same Database**: Unified data across all interfaces

### With GitHub Copilot
- **Chat Participant**: Native integration with Copilot Chat
- **Prompt Injection**: Direct insertion into conversations
- **Context Aware**: Understands current file/project context
- **Follow-up Suggestions**: Smart recommendations for next actions

### With VS Code
- **Sidebar Integration**: Native tree view panels
- **Command Palette**: Standard VS Code commands
- **Webview Panels**: Rich detail views for prompts/templates
- **File System**: Create copilot-instructions.md files
- **Settings**: Standard VS Code configuration

## 📊 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| ✅ Chat Participant | Ready | `@copilot-prompter` integration |
| ✅ Slash Commands | Ready | `/prompt`, `/template`, `/search` etc. |
| ✅ Sidebar Panels | Ready | Tree view for prompts/templates |
| ✅ Authentication | Ready | JWT-based secure login |
| ✅ Backend Switching | Ready | Node.js ↔ Java backend toggle |
| ✅ Search Functionality | Ready | Fuzzy search across content |
| ✅ Copy/Paste | Ready | Clipboard integration |
| ✅ File Creation | Ready | Auto-generate copilot-instructions.md |
| ✅ Rich UI | Ready | Webview panels with VS Code theming |
| ✅ Error Handling | Ready | Graceful degradation and user feedback |

## 🚀 Next Steps

1. **Install the extension**
2. **Configure your backend**
3. **Authenticate with your credentials**
4. **Start using `@copilot-prompter` in Copilot Chat**
5. **Explore the sidebar panels**
6. **Create your first copilot-instructions.md**

Happy prompting! 🎉
