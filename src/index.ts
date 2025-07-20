#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { saveComponent, listComponents, readComponents, loadComponents } from "./storage.js";

const server = new McpServer({
  name: "save-component",
  version: "1.0.0",
});

server.tool("save_component", {
  name: z.string().describe("The name of the component (e.g., 'Button', 'Card'). This will be the folder and file name."),
  code: z.string().describe("The full code for the component, including imports and exports."),
  description: z.string().describe("A detailed description of how to use the component, its props, etc."),
}, async ({ name, code, description }) => {
  try {
    await saveComponent(name, code, description);
    return {
      content: [{ type: "text", text: `Component "${name}" saved successfully.` }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error saving component: ${(error as Error).message}` }],
      isError: true,
    };
  }
});

server.tool("list_components", {}, async () => {
  try {
    const components = await listComponents();
    if (components.length === 0) {
      return { content: [{ type: "text", text: "No components found." }] };
    }
    const componentList = components.map(c => `- ${c}`).join('\n');
    return {
      content: [{ type: "text", text: `# Available Components\n\n${componentList}` }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing components: ${(error as Error).message}` }],
      isError: true,
    };
  }
});

server.tool("read_components", {
  names: z.array(z.string()).describe("An array of component names to read."),
}, async ({ names }) => {
  try {
    const components = await readComponents(names);
    const foundComponents = components.filter(c => c !== null) as import('./storage.js').Component[];
    const notFoundNames = names.filter((name, i) => components[i] === null);

    let responseText = '';
    if (foundComponents.length > 0) {
      responseText += foundComponents.map(c => 
        `# ${c.name}\n\n## Usage\n${c.description}\n\n## Code\n\`\`\`tsx\n${c.code}\n\`\`\``
      ).join('\n\n---\n\n');
    }
    if (notFoundNames.length > 0) {
      if (responseText.length > 0) responseText += '\n\n---\n\n';
      responseText += `Could not find the following components: ${notFoundNames.join(', ')}`;
    }
    if (!responseText) responseText = 'No components found for the given names.';

    return { content: [{ type: "text", text: responseText }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error reading components: ${(error as Error).message}` }],
      isError: true,
    };
  }
});

server.tool("load_components", {
  names: z.array(z.string()).describe("An array of component names to load into your workspace."),
  targetDir: z.string().describe("The absolute path to the target directory (e.g., a 'ui' or 'components' folder)."),
}, async ({ names, targetDir }) => {
  try {
    const { loaded, failed } = await loadComponents(names, targetDir);
    let responseText = '';
    if (loaded.length > 0) {
      responseText += `Successfully loaded components:\n- ${loaded.join('\n- ')}\n\n`;
    }
    if (failed.length > 0) {
      responseText += `Failed to load components:\n- ${failed.join('\n- ')}`;
    }
    if (!responseText) {
      responseText = 'No components were specified to load.';
    }
    return { content: [{ type: "text", text: responseText }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error loading components: ${(error as Error).message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Save Component MCP server running with new folder structure logic."); 