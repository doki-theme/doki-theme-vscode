import {DokiTheme, Sticker} from "./DokiTheme";
import path from 'path';
import fs from "fs";
import {satsukiSticker} from "./StickerHolder";

const main = require.main || {filename: 'yeet'};
const editorCss = path.join(path.dirname(main.filename), 'vs', 'workbench', 'workbench.desktop.main.css');
const editorCssCopy = path.join(path.dirname(main.filename), 'vs', 'workbench', 'workbench.desktop.main.css.copy');

function getVsCodeCss() {
  if (!fs.existsSync(editorCssCopy)) {
    fs.copyFileSync(editorCss, editorCssCopy);
  }
  console.log(editorCssCopy);
  return fs.readFileSync(editorCssCopy, 'utf-8')
    .replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '')
    .replace(/\s*$/, '');
}

function buildStickerCss(sticker: Sticker): string {
  const stickerUrl = satsukiSticker;
  const style = 'content:\'\';pointer-events:none;position:absolute;z-index:99999;width:100%;height:100%;background-position:100% 100%;background-repeat:no-repeat;opacity:1;';
  return `
/*css-background-start*/

[id="workbench.parts.editor"] .split-view-view:nth-child(1) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::after{background-image: url('${stickerUrl}');${style}

[id="workbench.parts.editor"] .split-view-view:nth-child(2) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::after{background-image: url('${stickerUrl}');${style}

[id="workbench.parts.editor"] .split-view-view:nth-child(3) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::after{background-image: url('${stickerUrl}');${style}

[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

/*css-background-end*/
`;
}

function buildStyles(sticker: Sticker): string {
  let vsCodeCss = getVsCodeCss();
  return vsCodeCss + buildStickerCss(sticker);

}
function installEditorStyles(styles: string) {
  fs.writeFileSync(editorCss, styles, 'utf-8');
}

export function installSticker(dokiTheme: DokiTheme) {
  const stickerStyles = buildStyles(dokiTheme.sticker);
  installEditorStyles(stickerStyles);
}

