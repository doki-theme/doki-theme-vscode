import * as vscode from "vscode";
import { DokiTheme } from "./DokiTheme";
import { installSticker, removeStickers } from "./StickerService";
import { VSCodeGlobals } from "./VSCodeGlobals";
import { StatusBarComponent } from "./StatusBar";
import { showStickerSupportWindow } from "./SupportService";

export const ACTIVE_THEME = 'doki.theme.active';

export enum InstallStatus {
  INSTALLED, NOT_INSTALLED, FAILURE
}

const FIRST_TIME_STICKER_INSTALL = 'doki.sticker.first.install';
function isFirstTimeInstalling(context: vscode.ExtensionContext) {
  return !context.globalState.get(FIRST_TIME_STICKER_INSTALL);
}

async function attemptToInstall(
  dokiTheme: DokiTheme,
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  if (isFirstTimeInstalling(context)) {
    const stickerInstall = 'Install Stickers';
    const result = await vscode.window.showWarningMessage(`Installing stickers requires this extension to c͇o̪̜r̴̫̮̰͖r̨ư̼͎p͙̞̻͇̤̠t́ VS-Code. You will have to use the "Remove Sticker/Background" command to restore VS Code back to supported status. I won't show you this message again in the future. :)`, {
      modal: true
    }, {
      title: stickerInstall, isCloseAffordance: false
    });

    if (result && result.title === stickerInstall) {
      const installStatus = performStickerInstall(dokiTheme);
      if (installStatus === InstallStatus.INSTALLED) {
        context.globalState.update(FIRST_TIME_STICKER_INSTALL, true);
      }
      return installStatus;
    } else {
      return InstallStatus.NOT_INSTALLED;
    }
  } else {
    return performStickerInstall(dokiTheme);
  }
}

function performStickerInstall(dokiTheme: DokiTheme) {
  const installResult = installSticker(dokiTheme);
  return installResult ? InstallStatus.INSTALLED :
    InstallStatus.FAILURE;
}

export function activateTheme(
  dokiTheme: DokiTheme,
  context: vscode.ExtensionContext
) {
  attemptToInstall(dokiTheme, context).then(didInstall => {
    if (didInstall === InstallStatus.INSTALLED) {
      VSCodeGlobals.globalState.update(ACTIVE_THEME, dokiTheme.displayName);
      StatusBarComponent.setText(dokiTheme.displayName);
      vscode.window.showInformationMessage(`${dokiTheme.name} installed!\n Please restart your IDE`);
    } else if (didInstall === InstallStatus.FAILURE) {
      showStickerSupportWindow(context);
      vscode.window.showErrorMessage(`Unable to install ${dokiTheme.name}, please see active tab for more information.`);
    }
  });
}


// :(
export function uninstallImages(
  context: vscode.ExtensionContext
) {
  const stickersRemoved = removeStickers();
  if (stickersRemoved === InstallStatus.INSTALLED) {
    vscode.window.showInformationMessage(`Removed Images. Please restart your restored IDE`);
  } else if (stickersRemoved === InstallStatus.FAILURE) {
    showStickerSupportWindow(context);
    vscode.window.showErrorMessage(`Unable to remove stickers/background, please see active tab for more information.`);
  }
}