import path from 'path';
import fs from "fs";

export const ASSETS_URL = `https://doki.assets.unthrottled.io`;
export const VSCODE_ASSETS_URL = `${ASSETS_URL}/stickers/vscode`;
export const BACKGROUND_ASSETS_URL = `${ASSETS_URL}/backgrounds/wallpapers`;
export const WALLPAPER_ASSETS_URL = `${ASSETS_URL}/backgrounds/wallpapers/transparent`;
export const SCREENSHOT_ASSETS_URL = `${ASSETS_URL}/screenshots`;


const main = require.main || { filename: 'yeet' };
export const defaultWorkbenchDirectory = path.join(path.dirname(main.filename), 'vs', 'workbench');
export const isWSL = () => !fs.existsSync(defaultWorkbenchDirectory);

const resolveWorkbench = () => {
  if (!isWSL()) {
    return defaultWorkbenchDirectory;
  }

  const usersPath = path.resolve('/mnt', 'c', 'Users');
  const users = fs.readdirSync(usersPath);

  return users.map(user => path.resolve(usersPath, user, 'AppData',
      'Local', 'Programs', 'Microsoft VS Code', 'resources',
      'app', 'out', 'vs', 'workbench'))
      .filter(path => fs.existsSync(path))
      .find(Boolean) || defaultWorkbenchDirectory;

};

export const workbenchDirectory = resolveWorkbench();

const CODE_SERVER_FILE = 'web.api';
const getFileName = () => {
  return fs.existsSync(path.join(workbenchDirectory, `workbench.desktop.main.css`)) ?
    'desktop.main' : CODE_SERVER_FILE;
};

const fileName = getFileName();

const CSS_FILE_NAME = `workbench.${fileName}.css`;
export const CSS_COPY_FILE_NAME = `${CSS_FILE_NAME}.copy`;

export const editorCss = path.join(workbenchDirectory, CSS_FILE_NAME);
export const editorCssCopy = path.join(workbenchDirectory, CSS_COPY_FILE_NAME);

