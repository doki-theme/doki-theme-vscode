import path from 'path';
import fs from "fs";
import {vscode} from './vsc'

export const ASSETS_URL = `https://doki.assets.unthrottled.io`;
export const VSCODE_ASSETS_URL = `${ASSETS_URL}/stickers/vscode`;
export const BACKGROUND_ASSETS_URL = `${ASSETS_URL}/backgrounds/wallpapers`;
export const ACTUAL_BACKGROUND_ASSETS_URL = `${ASSETS_URL}/backgrounds`;
export const WALLPAPER_ASSETS_URL = `${ASSETS_URL}/backgrounds/wallpapers/transparent`;
export const SCREENSHOT_ASSETS_URL = `${ASSETS_URL}/screenshots`;


export const isWSL = () => !fs.existsSync(getDefaultWorkBenchDirectory());
const getDefaultWorkBenchDirectory = () => {
  const mainFilename = require.main?.filename;
  const vscodeInstallationPath = vscode?.env.appRoot;
  const appRoot = mainFilename?.length ? path.dirname(mainFilename) : path.join(vscodeInstallationPath!, 'out');
  return path.join(appRoot, 'vs', 'workbench');
};

const resolveWorkbench = () => {
  if (!isWSL()) {
    return getDefaultWorkBenchDirectory();
  }

  try {
    const usersPath = path.resolve('/mnt', 'c', 'Users');
    const users = fs.readdirSync(usersPath);

    return users.map(user => path.resolve(usersPath, user, 'AppData',
      'Local', 'Programs', 'Microsoft VS Code', 'resources',
      'app', 'out', 'vs', 'workbench'))
      .filter(path => fs.existsSync(path))
      .find(Boolean) || getDefaultWorkBenchDirectory();
  } catch (error) {
    return getDefaultWorkBenchDirectory();
  }
};

export const workbenchDirectory = resolveWorkbench();

const REMOTE_CODE_SERVER_FILE = `web.main`;
const CODE_SERVER_FILE = 'web.api';
const getFileName = () => {
  if (fs.existsSync(path.join(workbenchDirectory, `workbench.web.main.css`))) {
    return REMOTE_CODE_SERVER_FILE;
  }

  const hasRegularVSCodeStuff = fs.existsSync(path.join(workbenchDirectory, `workbench.desktop.main.css`));
  return hasRegularVSCodeStuff ?
    'desktop.main' : CODE_SERVER_FILE;
};

const fileName = getFileName();

const CSS_FILE_NAME = `workbench.${fileName}.css`;
export const CSS_COPY_FILE_NAME = `${CSS_FILE_NAME}.copy`;

export const editorCss = path.join(workbenchDirectory, CSS_FILE_NAME);
export const editorCssCopy = path.join(workbenchDirectory, CSS_COPY_FILE_NAME);

export const appDirectory = path.resolve(workbenchDirectory, '..', '..', '..');

