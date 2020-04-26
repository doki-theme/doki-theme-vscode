import path from 'path';
import fs from "fs";

export const ASSETS_URL = `https://doki.assets.unthrottled.io`;
export const VSCODE_ASSETS_URL = `${ASSETS_URL}/stickers/vscode`;
export const BACKGROUND_ASSETS_URL = `${ASSETS_URL}/backgrounds`;
export const SCREENSHOT_ASSETS_URL = `${ASSETS_URL}/screenshots`;


const main = require.main || { filename: 'yeet' };
export const workbenchDirectory = path.join(path.dirname(main.filename), 'vs', 'workbench');

const CODE_SERVER_FILE = 'web.api';
const getFileName = () => {
  return fs.existsSync(path.join(workbenchDirectory, `workbench.desktop.main.css`)) ?
    'desktop.main' : CODE_SERVER_FILE;
};

const fileName = getFileName();

export const editorCss = path.join(workbenchDirectory, `workbench.${fileName}.css`);
export const editorCssCopy = path.join(workbenchDirectory, `workbench.${fileName}.css.copy`);

export const isCodeServer = () => fileName === CODE_SERVER_FILE;
