import * as vscode from "vscode";
import fs from "fs";
import { editorCss, editorCssCopy } from "./ENV";
import { attemptToUpdateSticker } from "./StickerUpdateService";
import { Sticker } from "./extension";

export enum InstallStatus {
  INSTALLED,
  NOT_INSTALLED,
  FAILURE,
}

const stickerComment = "/* Stickers */";

const getStickerIndex = (currentCss: string) => currentCss.indexOf(stickerComment);

// Was VS Code upgraded when stickers where installed?
function isCssPrestine() {
  const currentCss = fs.readFileSync(editorCss, "utf-8");
  return getStickerIndex(currentCss) < 0;
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
    "content:'';pointer-events:none;position:absolute;z-index:9001;width:100%;height:100%;background-position:100% 97%;background-repeat:no-repeat;opacity:1;";
  return `
  ${stickerComment}
  body > .monaco-workbench > .monaco-grid-view > .monaco-grid-branch-node > .monaco-split-view2 > .split-view-container::after,
  body > .monaco-workbench > .monaco-grid-view > .monaco-grid-branch-node > .monaco-split-view2 > .monaco-scrollable-element > .split-view-container::after
  {background-image: url('${stickerUrl}');${style}}

  .notifications-toasts {
    z-index: 9002 !important;
  }

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
  sticker: Sticker,
  context: vscode.ExtensionContext
): Promise<boolean> {
  if (canWrite()) {
    try {
      const stickersAndWallpaper = await attemptToUpdateSticker(
        context,
        sticker
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

const scrubFileIfNecessary = () => {
  const currentCss = fs.readFileSync(editorCss, "utf-8");
  const stickerIndex = getStickerIndex(currentCss);
  if (stickerIndex >= 0){
    fs.writeFileSync(editorCss, currentCss.substr(0, stickerIndex).trim(), "utf-8");
  }
};

// :(
export function removeStickers(): InstallStatus {
  if (canWrite()) {
    if (fs.existsSync(editorCssCopy)) {
      try {
        // fs.unlinkSync(editorCss);
        // fs.copyFileSync(editorCssCopy, editorCss);
        // fs.unlinkSync(editorCssCopy);
        scrubFileIfNecessary();
        return InstallStatus.INSTALLED;
      } catch (e) {
        console.error("Unable to remove stickers!", e);
        return InstallStatus.FAILURE;
      }
    }
    scrubFileIfNecessary();
    return InstallStatus.NOT_INSTALLED;
  }

  return InstallStatus.FAILURE;
}
