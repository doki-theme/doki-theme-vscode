import * as vscode from "vscode";
import {DokiTheme} from "./DokiTheme";
import {InstallStatus, installSticker, removeStickers} from "./StickerService";
import {VSCodeGlobals} from "./VSCodeGlobals";
import {StatusBarComponent} from "./StatusBar";
import {showStickerInstallationSupportWindow, showStickerRemovalSupportWindow} from "./SupportService";
import DokiThemeDefinitions from "./DokiThemeDefinitions";

export const ACTIVE_THEME = 'doki.theme.active';


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
    const result = await vscode.window.showWarningMessage(`Installing stickers requires me to corrupt VS-Code by modifying CSS. You will have to use the "Remove Sticker/Background" command to restore VS Code back to supported status before unistalling. I won't show you this message again in the future if you choose to install.`, {
      modal: true
    }, {
      title: stickerInstall, isCloseAffordance: false
    });

    if (result && result.title === stickerInstall) {
      context.globalState.update(FIRST_TIME_STICKER_INSTALL, true);
      return performStickerInstall(dokiTheme, context);
    } else {
      return InstallStatus.NOT_INSTALLED;
    }
  } else {
    return performStickerInstall(dokiTheme, context);
  }
}

function performStickerInstall(dokiTheme: DokiTheme, context: vscode.ExtensionContext) {
  const installResult = installSticker(dokiTheme, context);
  return installResult ? InstallStatus.INSTALLED :
    InstallStatus.FAILURE;
}

export function activateTheme(
  dokiTheme: DokiTheme,
  context: vscode.ExtensionContext
) {
  attemptToInstall(dokiTheme, context).then(didInstall => {
    if (didInstall === InstallStatus.INSTALLED) {
      VSCodeGlobals.globalState.update(ACTIVE_THEME, dokiTheme.id);
      StatusBarComponent.setText(dokiTheme.displayName);
      vscode.window.showInformationMessage(`${dokiTheme.name} installed!\n Please restart your IDE`);
    } else if (didInstall === InstallStatus.FAILURE) {
      showStickerInstallationSupportWindow(context);
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
    showStickerRemovalSupportWindow(context);
    vscode.window.showErrorMessage(`Unable to remove stickers/background, please see active tab for more information.`);
  }
}

export const getCurrentTheme = (): DokiTheme => {
  const currentThemeId = VSCodeGlobals.globalState.get(ACTIVE_THEME);
  const dokiThemeDefinition = DokiThemeDefinitions.find(
    dokiDefinition => 
    dokiDefinition.themeDefinition.information.id === currentThemeId ||
    // todo: remove this after deploy.
    dokiDefinition.themeDefinition.information.displayName == currentThemeId
  ) || DokiThemeDefinitions[0];
  return new DokiTheme(dokiThemeDefinition.themeDefinition);
};