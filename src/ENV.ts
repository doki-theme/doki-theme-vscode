import path from 'path';
import fs from "fs";

export const ASSETS_URL = `https://doki.assets.unthrottled.io`;
export const VSCODE_ASSETS_URL = `${ASSETS_URL}/stickers/vscode`;
export const BACKGROUND_ASSETS_URL = `${ASSETS_URL}/backgrounds`;
export const SCREENSHOT_ASSETS_URL = `${ASSETS_URL}/screenshots`;


const main = require.main || { filename: 'yeet' };
const defaultWorkbenchDirectory = path.join(path.dirname(main.filename), 'vs', 'workbench');
const isWSL = !fs.existsSync(defaultWorkbenchDirectory);

export const workbenchDirectory = resolveWorkbench();

console.log('dis workbench', workbenchDirectory, fs.existsSync(workbenchDirectory));

const CODE_SERVER_FILE = 'web.api';
const getFileName = () => {
  return fs.existsSync(path.join(workbenchDirectory, `workbench.desktop.main.css`)) ?
    'desktop.main' : CODE_SERVER_FILE;
};

const fileName = getFileName();

export const editorCss = path.join(workbenchDirectory, `workbench.${fileName}.css`);
export const editorCssCopy = path.resolve('/tmp', `workbench.${fileName}.css.copy`);

export const isCodeServer = () => fileName === CODE_SERVER_FILE;
function resolveWorkbench() {
  if (!isWSL) {
    return defaultWorkbenchDirectory;
  }

  const userPath = path.resolve('/mnt', 'c', 'Users');
  const users = fs.readdirSync(userPath);

  return users.map(user => path.resolve(userPath, user, 'AppData',
    'Local', 'Programs', 'Microsoft\ VS\ Code', 'resources',
    'app', 'out', 'vs', 'workbench'))
    .filter(path => fs.existsSync(path))
    .find(Boolean) || defaultWorkbenchDirectory;

}

