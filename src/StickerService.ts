import * as vscode from "vscode";
import { DokiTheme } from "./DokiTheme";
import path from 'path';
import fs from "fs";
import { resolveLocalStickerPath, isStickerNotCurrent, StickerUpdateStatus } from "./StickerUpdateService";
import { performGet } from "./RESTClient";
import { ASSETS_URL, BACKGROUND_ASSETS_URL, VSCODE_ASSETS_URL } from "./ENV";

export enum InstallStatus {
  INSTALLED, NOT_INSTALLED, FAILURE
}

const main = require.main || { filename: 'yeet' };
export const workbenchDirectory = path.join(path.dirname(main.filename), 'vs', 'workbench');

const getFileName = () => {
  return fs.existsSync(path.join(workbenchDirectory, `workbench.desktop.main.css`)) ?
    'desktop.main' : 'web.api';
};

const fileName = getFileName();

const editorCss = path.join(workbenchDirectory, `workbench.${fileName}.css`);
const editorCssCopy = path.join(workbenchDirectory, `workbench.${fileName}.css.copy`);

// Was VS Code upgraded when stickers where installed?
function isCssPrestine() {
  const currentCss = fs.readFileSync(editorCss, 'utf-8');
  return currentCss.indexOf(ASSETS_URL) < 0;
}

function ensureRightCssCopy() {
  if (!fs.existsSync(editorCssCopy) || isCssPrestine()) {
    fs.copyFileSync(editorCss, editorCssCopy);
  }
}

function getVsCodeCss() {
  ensureRightCssCopy();
  return fs.readFileSync(editorCssCopy, 'utf-8');
}

function buildStickerCss({
  stickerDataURL: stickerUrl,
  backgroundImageURL: backgroundImage
}: DokiStickers): string {
  const style = 'content:\'\';pointer-events:none;position:absolute;z-index:99999;width:100%;height:100%;background-position:100% 100%;background-repeat:no-repeat;opacity:1;';
  return `
  /* Stickers */
  .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::after{background-image: url('${stickerUrl}');${style}}

  /* Background Image */
  .monaco-workbench .part.editor > .content {
    background-image: url('${BACKGROUND_ASSETS_URL}/${backgroundImage}') !important;
    background-position: center;
    background-size: cover;
    content:'';
    z-index:99999;
    width:100%;
    height:100%;
    background-repeat:no-repeat;
    opacity:1;
}
`;
}

function buildStyles(dokiStickers: DokiStickers): string {
  let vsCodeCss = getVsCodeCss();
  return vsCodeCss + buildStickerCss(dokiStickers);

}
function installEditorStyles(styles: string) {
  fs.writeFileSync(editorCss, styles, 'utf-8');
}

function canWrite(): boolean {
  try {
    fs.accessSync(editorCss, fs.constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export interface DokiStickers {
  stickerDataURL: string;
  backgroundImageURL: string;
}

const downloadSticker = async (stickerPath: string, localDestination: string) => {
  const parentDirectory = path.dirname(localDestination);
  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory, { recursive: true });
  }

  const stickerUrl = `${VSCODE_ASSETS_URL}${stickerPath}`;
  console.log(`Downloading image: ${stickerUrl}`);
  const stickerInputStream = await performGet(stickerUrl);
  console.log('Image Downloaded!');
  fs.writeFileSync(localDestination, stickerInputStream.read());
};

const readFileToDataURL = (localStickerPath: string): string => {
  return `file://${localStickerPath.replace(path.sep, '/')}`;
};

export async function getLatestStickerAndBackground(
  dokiTheme: DokiTheme,
  context: vscode.ExtensionContext,
  stickerStatus: StickerUpdateStatus
): Promise<DokiStickers> {
  const localStickerPath = resolveLocalStickerPath(
    dokiTheme, context
  );
  if (stickerStatus === StickerUpdateStatus.STALE || 
    !fs.existsSync(localStickerPath) ||
    await isStickerNotCurrent(dokiTheme, localStickerPath)) {
    await downloadSticker(dokiTheme.sticker.path, localStickerPath);
  }

  const stickerDataURL = readFileToDataURL(localStickerPath);
  return {
    stickerDataURL,
    backgroundImageURL: dokiTheme.sticker.name
  };
}

export async function installSticker(
  dokiTheme: DokiTheme,
  context: vscode.ExtensionContext,
  stickerStatus: StickerUpdateStatus = StickerUpdateStatus.NOT_CHECKED
): Promise<boolean> {
  if (canWrite()) {
    try {
      const stickersAndBackground = await getLatestStickerAndBackground(
        dokiTheme,
        context,
        stickerStatus
      );
      const stickerStyles = buildStyles(stickersAndBackground);
      installEditorStyles(stickerStyles);
      return true;
    } catch (e) {
      console.error('Unable to install sticker!', e);
    }
  }

  return false;
}

// :(
export function removeStickers(): InstallStatus {
  if (canWrite()) {
    if (fs.existsSync(editorCssCopy)) {
      fs.unlinkSync(editorCss);
      fs.copyFileSync(editorCssCopy, editorCss);
      fs.unlinkSync(editorCssCopy);
      return InstallStatus.INSTALLED;
    }
    return InstallStatus.NOT_INSTALLED;
  }

  return InstallStatus.FAILURE;
}