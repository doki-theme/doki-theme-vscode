import * as vscode from "vscode";
import { DokiTheme, DokiSticker, StickerType } from "./DokiTheme";
import {
  InstallStatus,
  removeStickers,
  installStickersAndWallPaper,
} from "./StickerService";
import { VSCodeGlobals } from "./VSCodeGlobals";
import { StatusBarComponent } from "./StatusBar";
import {
  showStickerInstallationSupportWindow,
  showStickerRemovalSupportWindow,
} from "./SupportService";
import DokiThemeDefinitions from "./DokiThemeDefinitions";
import { Sticker, DokiThemeDefinition } from "./extension";

export const ACTIVE_THEME = "doki.theme.active";

export const ACTIVE_STICKER = "doki.sticker.active";

const FIRST_TIME_STICKER_INSTALL = "doki.sticker.first.install";
function isFirstTimeInstalling(context: vscode.ExtensionContext) {
  return !context.globalState.get(FIRST_TIME_STICKER_INSTALL);
}

async function attemptToInstall(
  sticker: Sticker,
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  if (isFirstTimeInstalling(context)) {
    const stickerInstall = "Install Stickers";
    const result = await vscode.window.showWarningMessage(
      `Installing stickers requires me to corrupt VS-Code by modifying CSS. You will have to use the "Remove Sticker/Background" command to restore VS Code back to supported status before unistalling. I won't show you this message again in the future if you choose to install.`,
      {
        modal: true,
      },
      {
        title: stickerInstall,
        isCloseAffordance: false,
      }
    );

    if (result && result.title === stickerInstall) {
      context.globalState.update(FIRST_TIME_STICKER_INSTALL, true);
      return performStickerInstall(sticker, context);
    } else {
      return InstallStatus.NOT_INSTALLED;
    }
  } else {
    return performStickerInstall(sticker, context);
  }
}

async function performStickerInstall(
  sticker: Sticker,
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  const installResult = await installStickersAndWallPaper(sticker, context);
  return installResult ? InstallStatus.INSTALLED : InstallStatus.FAILURE;
}

export function activateTheme(
  dokiTheme: DokiTheme,
  currentSticker: DokiSticker,
  context: vscode.ExtensionContext
) {
  vscode.window.showInformationMessage(
    `Please wait, installing ${dokiTheme.name}.`
  );
  attemptToInstall(currentSticker.sticker, context).then((didInstall) => {
    if (didInstall === InstallStatus.INSTALLED) {
      VSCodeGlobals.globalState.update(ACTIVE_THEME, dokiTheme.id);
      VSCodeGlobals.globalState.update(ACTIVE_STICKER, currentSticker.type);
      StatusBarComponent.setText(dokiTheme.displayName);
      vscode.window.showInformationMessage(
        `${dokiTheme.name} installed!\n Please restart your IDE`
      );
    } else if (didInstall === InstallStatus.FAILURE) {
      showStickerInstallationSupportWindow(context);
      vscode.window.showErrorMessage(
        `Unable to install ${dokiTheme.name}, please see active tab for more information.`
      );
    }
  });
}

// :(
export function uninstallImages(context: vscode.ExtensionContext) {
  const stickersRemoved = removeStickers();
  if (
    stickersRemoved === InstallStatus.INSTALLED ||
    stickersRemoved === InstallStatus.NOT_INSTALLED
  ) {
    vscode.window.showInformationMessage(
      `Removed Images. Please restart your restored IDE`
    );
  } else if (stickersRemoved === InstallStatus.FAILURE) {
    showStickerRemovalSupportWindow(context);
    vscode.window.showErrorMessage(
      `Unable to remove stickers/background, please see active tab for more information.`
    );
  }
}

export const getCurrentThemeAndSticker = (): {
  theme: DokiTheme;
  sticker: DokiSticker;
} => {
  const currentThemeId = VSCodeGlobals.globalState.get(ACTIVE_THEME);
  const dokiThemeDefinition =
    DokiThemeDefinitions.find(
      (dokiDefinition) =>
        dokiDefinition.themeDefinition.information.id === currentThemeId
    ) || DokiThemeDefinitions[0];
  const currentStickerType =
    (VSCodeGlobals.globalState.get(ACTIVE_STICKER) as StickerType) ||
    StickerType.DEFAULT;
  return {
    theme: new DokiTheme(dokiThemeDefinition.themeDefinition),
    sticker: {
      type: currentStickerType,
      sticker: getSticker(
        dokiThemeDefinition.themeDefinition,
        currentStickerType
      ),
    },
  };
};

export function getSticker(
  dokiThemeDefinition: DokiThemeDefinition,
  stickerType: StickerType
) {
  const defaultSticker = dokiThemeDefinition.stickers.default;
  return StickerType.SECONDARY === stickerType
    ? dokiThemeDefinition.stickers.secondary || defaultSticker
    : defaultSticker;
}
