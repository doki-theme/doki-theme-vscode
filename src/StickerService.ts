import * as vscode from "vscode";
import { DokiTheme } from "./DokiTheme";
import fs from "fs";
import { ASSETS_URL, editorCss, editorCssCopy } from "./ENV";
import { attemptToUpdateSticker } from "./StickerUpdateService";

export enum InstallStatus {
  INSTALLED,
  NOT_INSTALLED,
  FAILURE,
}

// Was VS Code upgraded when stickers where installed?
function isCssPrestine() {
  const currentCss = fs.readFileSync(editorCss, "utf-8");
  return currentCss.indexOf(ASSETS_URL) < 0;
}

function ensureRightCssCopy() {
  if (!fs.existsSync(editorCssCopy) || isCssPrestine()) {
    fs.copyFileSync(editorCss, editorCssCopy);
  }
}

function getVsCodeCss() {
  ensureRightCssCopy();
  return fs.readFileSync(editorCssCopy, "utf-8");
}

function buildStickerCss({
  stickerDataURL: stickerUrl,
  backgroundImageURL: wallpaperUrl,
}: DokiStickers): string {
  const style =
    "content:'';pointer-events:none;position:absolute;z-index:9001;width:100%;height:100%;background-position:100% 100%;background-repeat:no-repeat;opacity:1;";
  return `
  /* Stickers */
  .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::after{background-image: url('${stickerUrl}');${style}}

  /* Background Image */
  .monaco-workbench .part.editor > .content {
    background-image: url('${wallpaperUrl}') !important;
    background-position: center;
    background-size: cover;
    content:'';
    z-index:9001;
    width:100%;
    height:100%;
    background-repeat:no-repeat;
    opacity:1;
}
`;
}

function buildStyles(dokiStickers: DokiStickers): string {
  return `${getVsCodeCss()}${buildStickerCss(dokiStickers)}`;
}

function installEditorStyles(styles: string) {
  fs.writeFileSync(editorCss, styles, "utf-8");
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

export async function installStickersAndWallPaper(
  dokiTheme: DokiTheme,
  context: vscode.ExtensionContext
): Promise<boolean> {
  if (canWrite()) {
    try {
      const stickersAndWallpaper = await attemptToUpdateSticker(
        context,
        dokiTheme
      );
      const stickerStyles = buildStyles(stickersAndWallpaper);
      installEditorStyles(stickerStyles);
      return true;
    } catch (e) {
      console.error("Unable to install sticker!", e);
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
