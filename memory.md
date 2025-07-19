# Memory File

## Project: Save Component MCP Server

### Description
This project implements an MCP (Model Context Protocol) server that allows AI to save, list, and read components it has created. The server provides tools for managing code components with usage descriptions.

### Files Created
- `package.json` - Project configuration and dependencies
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - Main MCP server implementation
- `src/storage.ts` - Component storage system
- `.cursor/mcp.json` - MCP configuration for Cursor
- `components/.gitkeep` - Empty file to ensure the components directory is tracked by Git
- `README.md` - Instructions for using the server
- `build.bat` - Script to install dependencies and build the project

### Tools Implemented
1. `save_component` - Save a component with its code and usage description
2. `list_components` - List all saved components
3. `read_components` - Read one or more components by providing an array of component names

### Usage Instructions
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Start the server: `npm start`

The MCP server will be available to Cursor AI for managing components.

### Component Structure
Each component is stored as a JSON file with the following structure:
```json
{
  "name": "component-name",
  "code": "// Component code here",
  "description": "How to use this component",
  "createdAt": "ISO date string"
}
```

### Recent Updates
- Simplified the tool interface by using only `read_components` for both single and multiple component reads
- Updated the .cursorrules file to include a STEP 3 for component inventory
- Created sample components (Button, Card) to demonstrate functionality

### Note on Multi-Component Reading
The server supports reading both single and multiple components through the `read_components` tool, which takes an array of component names. After restarting the server, this tool works properly with the MCP tools interface. 