import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

export interface ComponentMeta {
  name: string;
  description: string;
  createdAt: string;
}

export interface Component extends ComponentMeta {
  code: string;
}

async function ensureComponentsDir(): Promise<void> {
  try {
    await fs.access(COMPONENTS_DIR);
  } catch {
    await fs.mkdir(COMPONENTS_DIR, { recursive: true });
  }
}

export async function saveComponent(name: string, code: string, description: string): Promise<Component> {
  await ensureComponentsDir();
  
  const componentDir = path.join(COMPONENTS_DIR, name);
  await fs.mkdir(componentDir, { recursive: true });

  const codeFilePath = path.join(componentDir, `${name}.tsx`);
  await fs.writeFile(codeFilePath, code, 'utf-8');

  const meta: ComponentMeta = {
    name,
    description,
    createdAt: new Date().toISOString(),
  };
  const metaFilePath = path.join(componentDir, `${name}.json`);
  await fs.writeFile(metaFilePath, JSON.stringify(meta, null, 2), 'utf-8');

  return { ...meta, code };
}

export async function listComponents(): Promise<string[]> {
  await ensureComponentsDir();
  const entries = await fs.readdir(COMPONENTS_DIR, { withFileTypes: true });
  return entries
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

async function readComponent(name: string): Promise<Component | null> {
  const componentDir = path.join(COMPONENTS_DIR, name);
  try {
    const metaFilePath = path.join(componentDir, `${name}.json`);
    const metaContent = await fs.readFile(metaFilePath, 'utf-8');
    const meta = JSON.parse(metaContent) as ComponentMeta;

    const codeFilePath = path.join(componentDir, `${name}.tsx`);
    const code = await fs.readFile(codeFilePath, 'utf-8');

    return { ...meta, code };
  } catch (error) {
    console.error(`Failed to read component "${name}":`, error);
    return null;
  }
}

export async function readComponents(names: string[]): Promise<(Component | null)[]> {
  return Promise.all(names.map(name => readComponent(name)));
}

export async function loadComponents(names: string[], targetDir: string): Promise<{ loaded: string[], failed: string[] }> {
  await ensureComponentsDir();
  const loaded: string[] = [];
  const failed: string[] = [];

  for (const name of names) {
    const sourcePath = path.join(COMPONENTS_DIR, name, `${name}.tsx`);
    const destinationPath = path.join(targetDir, `${name}.tsx`);
    try {
      await fs.mkdir(targetDir, { recursive: true });
      await fs.copyFile(sourcePath, destinationPath);
      loaded.push(name);
    } catch (error) {
      console.error(`Failed to load component "${name}" to "${targetDir}":`, error);
      failed.push(name);
    }
  }
  return { loaded, failed };
} 