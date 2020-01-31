import * as vscode from "vscode";
import {DokiTheme} from "./DokiTheme";
import {installSticker} from "./StickerService";
import {setLookAndFeel} from "./LaFService";
import {activateIcons} from "./IconService";
import {installBackground} from "./BackgroundService";

export function activateTheme(dokiTheme: DokiTheme) {
  installSticker(dokiTheme);
  installBackground(dokiTheme);
  setLookAndFeel(dokiTheme);
  activateIcons(dokiTheme);
  vscode.window.showInformationMessage(`${dokiTheme.name} has been activated, please restart your IDE`);
}


