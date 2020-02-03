import * as vscode from "vscode";
import {DokiTheme} from "./DokiTheme";
import {installSticker} from "./StickerService";

export function activateTheme(dokiTheme: DokiTheme) {
  installSticker(dokiTheme);
  vscode.window.showInformationMessage(`${dokiTheme.name} has been activated, please restart your IDE`);
}


