import * as vscode from "vscode";
import {DokiTheme} from "./DokiTheme";
import {installSticker} from "./StickerService";
import {installBackground} from "./BackgroundService";
import {setLookAndFeel} from "./LaFService";
import {activateIcons} from "./IconService";

export function activateTheme(dokiTheme: DokiTheme) {
  installSticker(dokiTheme);
  installBackground(dokiTheme);
  setLookAndFeel(dokiTheme);
  activateIcons(dokiTheme);
  vscode.window.showInformationMessage(`${dokiTheme.name} has been activated, please restart your IDE`);
}


