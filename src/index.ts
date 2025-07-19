#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { saveComponent, listComponents, readComponent, readComponents } from "./storage.js";

// Create MCP server
const server = new McpServer({
  name: "save-component",
  version: "1.0.0"
});

// Tool to save a component
server.tool("save_component", {
  name: z.string().describe("The name of the component (must be unique)"),
  code: z.string().describe("The component code"),
  description: z.string().describe("Description of how to use the component")
}, async ({ name, code, description }) => {
  try {
    const component = await saveComponent(name, code, description);
    return {
      content: [{ 
        type: "text", 
        text: `Component "${name}" saved successfully!\n\nCreated at: ${component.createdAt}`
      }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error saving component: ${(error as Error).message}` }],
      isError: true
    };
  }
});

// Tool to list all components
server.tool("list_components", {}, async () => {
  try {
    const components = await listComponents();
    
    if (components.length === 0) {
      return {
        content: [{ type: "text", text: "No components found." }]
      };
    }
    
    const componentList = components.map(c => 
      `- ${c.name} (Created: ${new Date(c.createdAt).toLocaleString()})`
    ).join('\n');
    
    return {
      content: [{ 
        type: "text", 
        text: `# Available Components\n\n${componentList}`
      }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing components: ${(error as Error).message}` }],
      isError: true
    };
  }
});

// Tool to read multiple components (can also read a single component)
server.tool("read_components", {
  names: z.array(z.string()).describe("The names of the components to read")
}, async ({ names }) => {
  try {
    const components = await readComponents(names);
    
    const foundComponents = components.filter(c => c !== null) as import('./storage.js').Component[];
    const notFoundNames = names.filter((name, i) => components[i] === null);
    
    let responseText = '';

    if (foundComponents.length > 0) {
      responseText += foundComponents.map(c => 
        `# ${c.name}\n\n## Usage\n${c.description}\n\n## Code\n\`\`\`\n${c.code}\n\`\`\``
      ).join('\n\n---\n\n');
    }

    if (notFoundNames.length > 0) {
      if (responseText.length > 0) {
        responseText += '\n\n---\n\n';
      }
      responseText += `Could not find the following components: ${notFoundNames.join(', ')}`;
    }

    if (responseText.length === 0) {
      responseText = 'No components found.';
    }

    return {
      content: [{ 
        type: "text", 
        text: responseText
      }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error reading components: ${(error as Error).message}` }],
      isError: true
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Save Component MCP server running"); 