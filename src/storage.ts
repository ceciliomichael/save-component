import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the components directory path
const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

// Component interface
export interface Component {
  name: string;
  code: string;
  description: string;
  createdAt: string;
}

// Ensure the components directory exists
export async function ensureComponentsDir(): Promise<void> {
  try {
    await fs.access(COMPONENTS_DIR);
  } catch (error) {
    await fs.mkdir(COMPONENTS_DIR, { recursive: true });
  }
}

// Save a component
export async function saveComponent(name: string, code: string, description: string): Promise<Component> {
  await ensureComponentsDir();
  
  const component: Component = {
    name,
    code,
    description,
    createdAt: new Date().toISOString(),
  };
  
  const filePath = path.join(COMPONENTS_DIR, `${name}.json`);
  await fs.writeFile(filePath, JSON.stringify(component, null, 2), 'utf-8');
  
  return component;
}

// List all components
export async function listComponents(): Promise<Component[]> {
  await ensureComponentsDir();
  
  const files = await fs.readdir(COMPONENTS_DIR);
  const componentFiles = files.filter(file => file.endsWith('.json'));
  
  const components: Component[] = [];
  
  for (const file of componentFiles) {
    const filePath = path.join(COMPONENTS_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');
    try {
      const component = JSON.parse(content) as Component;
      components.push(component);
    } catch (error) {
      console.error(`Error parsing component file ${file}:`, error);
    }
  }
  
  return components;
}

// Read a specific component
export async function readComponent(name: string): Promise<Component | null> {
  await ensureComponentsDir();
  
  const filePath = path.join(COMPONENTS_DIR, `${name}.json`);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Component;
  } catch (error) {
    return null;
  }
}

// Read multiple components
export async function readComponents(names: string[]): Promise<(Component | null)[]> {
  const components = await Promise.all(names.map(name => readComponent(name)));
  return components;
} 