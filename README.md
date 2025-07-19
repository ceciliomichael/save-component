# Save Component MCP Server

An MCP (Model Context Protocol) server that allows AI to save, list, and read components it has created. The server provides tools for managing code components with usage descriptions.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. The server will be available to Cursor AI after building.

## Available Tools

### save_component
Save a component with its code and usage description.

Parameters:
- `name` - The name of the component (must be unique)
- `code` - The component code
- `description` - Description of how to use the component

### list_components
List all saved components.

### read_components
Read one or more components.

Parameters:
- `names` - Array of component names to read (can be a single name or multiple names)

## Component Storage

Components are stored in the `components` directory as JSON files with the following structure:
```json
{
  "name": "component-name",
  "code": "// Component code here",
  "description": "How to use this component",
  "createdAt": "ISO date string"
}
``` 