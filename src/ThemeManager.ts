import * as vscode from "vscode";
import { DEFAULT_THEME_ID, DokiSticker, DokiTheme, StickerType } from "./DokiTheme";
import {
  hideWaterMark,
  InstallStatus,
  installStickers,
  installWallPaper,
  removeStickers,
} from "./StickerService";
import { VSCodeGlobals } from "./VSCodeGlobals";
import { StatusBarComponent } from "./StatusBar";
import {
  showStickerInstallationSupportWindow,
  showStickerRemovalSupportWindow,
} from "./SupportService";
import DokiThemeDefinitions from "./DokiThemeDefinitions";
import { DokiThemeDefinition, Sticker, StickerInstallPayload } from "./extension";
import { fixCheckSums, restoreChecksum } from "./CheckSumService";
import {
  clearAssetConfig,
  RestoreConfig,
  saveHiddenWatermarkConfig,
  saveStickerConfig,
  saveWallpaperConfig
} from "./AutoInstaller";
import { CONFIG_STATUS_BAR_NAME, getConfig } from "./ConfigWatcher";

export const ACTIVE_THEME = "doki.theme.active";

export const ACTIVE_STICKER = "doki.sticker.active";

const FIRST_TIME_STICKER_INSTALL = "doki.sticker.first.install";
export const handleInstallMessage = `Restart to see changes, please restart VSCode to remove the Unsupported warning.`

const createCulturedInstall = (themeId: string): string =>
  `doki.cultured.${themeId}`;

const CULTURED_STICKER_INSTALL = createCulturedInstall(
  "ea9a13f6-fa7f-46a4-ba6e-6cefe1f55160_test"
);

function isFirstTimeInstalling(context: vscode.ExtensionContext) {
  return !context.globalState.get(FIRST_TIME_STICKER_INSTALL);
}

async function conditionalInstall(
  storageKey: string,
  actionText: string,
  messageBody: string,
  installAsset: () => Promise<InstallStatus>,
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  const result = await vscode.window.showWarningMessage(
    messageBody,
    {
      modal: true,
    },
    {
      title: actionText,
      isCloseAffordance: false,
    }
  );

  if (result && result.title === actionText) {
    context.globalState.update(storageKey, true);
    return installAsset();
  } else {
    return InstallStatus.NOT_INSTALLED;
  }
}

async function attemptToInstallAsset(
  context: vscode.ExtensionContext,
  stickerInstallPayload: StickerInstallPayload,
  installAsset: () => Promise<InstallStatus>
): Promise<InstallStatus> {
  if (isCultured(context, stickerInstallPayload)) {
    const storageKey = CULTURED_STICKER_INSTALL;
    const actionText = "Yes, Please!";
    const messageBody = `You are about to install sexually suggestive content. Are you sure you want to continue? I won't show you this message again in the future if you choose to install.`;
    return conditionalInstall(
      storageKey,
      actionText,
      messageBody,
      installAsset,
      context
    );
  } else if (isFirstTimeInstalling(context)) {
    const actionText = "Install Theme Assets";
    const messageBody = `Installing theme assets requires me to corrupt VS-Code by modifying CSS. You will have to use the "Remove Sticker/Background" command to restore VS Code back to supported status before uninstalling. I won't show you this message again in the future if you choose to install.`;
    return conditionalInstall(
      FIRST_TIME_STICKER_INSTALL,
      actionText,
      messageBody,
      installAsset,
      context
    );
  } else {
    return installAsset();
  }
}

export async function attemptToInstallSticker(
  stickerInstallPayload: StickerInstallPayload,
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  return attemptToInstallAsset(context, stickerInstallPayload, () =>
    performStickerInstall(stickerInstallPayload, context)
  );
}

export async function attemptToInstallWallpaper(
  stickerInstallPayload: StickerInstallPayload,
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  return attemptToInstallAsset(context, stickerInstallPayload, () =>
    performWallpaperInstall(stickerInstallPayload, context)
  );
}

export async function attemptToInstallHideWatermark(
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  return attemptToInstallAsset(context, {
    sticker: {
      anchoring: "Facts: ",
      name: "Zero Two",
      path: "Best Girl",
    },
    theme: new DokiTheme(
      DokiThemeDefinitions
        .find(theme => theme.themeDefinition.information.id === DEFAULT_THEME_ID)!
        .themeDefinition
    ),
  }, () =>
    performHideWatermarkInstall()
  );
}

async function performStickerInstall(
  stickerInstallPayload: StickerInstallPayload,
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  return await installStickers(stickerInstallPayload, context);
}

async function performWallpaperInstall(
  stickerInstallPayload: StickerInstallPayload,
  context: vscode.ExtensionContext
): Promise<InstallStatus> {
  return await installWallPaper(stickerInstallPayload, context);
}

async function performHideWatermarkInstall(
): Promise<InstallStatus> {
  return await hideWaterMark();
}



export function activateThemeSticker(
  dokiTheme: DokiTheme,
  currentSticker: DokiSticker,
  context: vscode.ExtensionContext
) {
  return activateThemeAsset(
    dokiTheme,
    currentSticker,
    context,
    "Sticker",
    (sticker) => attemptToInstallSticker(sticker, context),
    saveStickerConfig,
  );
}

export function activateThemeWallpaper(
  dokiTheme: DokiTheme,
  currentSticker: DokiSticker,
  context: vscode.ExtensionContext
) {
  return activateThemeAsset(
    dokiTheme,
    currentSticker,
    context,
    "Wallpaper",
    (sticker) => attemptToInstallWallpaper(sticker, context),
    saveWallpaperConfig,
  );
}

export function activateHideWatermark(
  context: vscode.ExtensionContext
) {
  return attemptToInstallHideWatermark(context).then(
    installStatus => {
      if (installStatus === InstallStatus.INSTALLED) {
        fixCheckSums(context);
        const message = `VSCode Watermark hidden! ${handleInstallMessage}`;
        showInstallNotification(message);
        saveHiddenWatermarkConfig(context);
      } else if (installStatus === InstallStatus.FAILURE) {
        handleInstallFailure(context, getCurrentThemeAndSticker().theme);
      }
    }
  );
}

const QuitAction = "Quit";

export function activateThemeAsset(
  dokiTheme: DokiTheme,
  currentSticker: DokiSticker,
  context: vscode.ExtensionContext,
  assetType: string,
  installer: (stickerInstallPayload: StickerInstallPayload) => Promise<InstallStatus>,
  configSaver: (
    restoreConfig: RestoreConfig,
    context: vscode.ExtensionContext,
  ) => void,
) {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Please wait, installing ${dokiTheme.name}'s ${assetType}.`,
    cancellable: false,
  }, () => {
    return installer({
      sticker: currentSticker.sticker,
      theme: dokiTheme,
    }).then((didInstall) => {
      if (didInstall === InstallStatus.INSTALLED) {
        VSCodeGlobals.globalState.update(ACTIVE_THEME, dokiTheme.id);
        VSCodeGlobals.globalState.update(ACTIVE_STICKER, currentSticker.type);
        if (!getConfig().get(CONFIG_STATUS_BAR_NAME)) {
          StatusBarComponent.setText(dokiTheme.displayName);
        }
        fixCheckSums(context);
        const message = `${dokiTheme.name}'s ${assetType} installed! ${handleInstallMessage}`;
        showInstallNotification(message);
        configSaver({
          sticker: currentSticker,
          themeId: dokiTheme.id
        }, context);
      } else if (didInstall === InstallStatus.FAILURE) {
        handleInstallFailure(context, dokiTheme);
      } else if (didInstall === InstallStatus.NETWORK_FAILURE) {
        showNetworkErrorMessage(dokiTheme);
      }
    });
  });
}

export function showNetworkErrorMessage(dokiTheme: DokiTheme) {
  vscode.window.showErrorMessage(
    `Unable to install ${dokiTheme.name}, please check your network connection.`
  );
}

export function showInstallNotification(message: string) {
  vscode.window
    .showInformationMessage(
      message,
      { title: QuitAction }
    )
    .then((item) => {
      if (item) {
        vscode.commands.executeCommand("workbench.action.quit");
      }
    });
}

export function handleInstallFailure(context: vscode.ExtensionContext, dokiTheme: DokiTheme) {
  showStickerInstallationSupportWindow(context);
  vscode.window.showErrorMessage(
    `Unable to install ${dokiTheme.name}, please see active tab for more information.`
  );
}

// :(
export function uninstallImages(context: vscode.ExtensionContext) {
  const stickersRemoved = removeStickers();
  if (
    stickersRemoved === InstallStatus.INSTALLED ||
    stickersRemoved === InstallStatus.NOT_INSTALLED
  ) {
    clearAssetConfig(context);
    restoreChecksum();
    vscode.window
      .showInformationMessage(
        `Removed All Images. ${handleInstallMessage}`,
        { title: QuitAction }
      )
      .then((item) => {
        if (item) {
          vscode.commands.executeCommand("workbench.action.quit");
        }
      });
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
    ) ||
    DokiThemeDefinitions.find(def =>
      def.themeDefinition.information.id === DEFAULT_THEME_ID
    )!;
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
function isCultured(
  context: vscode.ExtensionContext,
  stickerInstallPayload: StickerInstallPayload
): boolean {
  return (
    stickerInstallPayload.sticker.name.indexOf("rias_onyx_spicy.png") > -1 &&
    !context.globalState.get(CULTURED_STICKER_INSTALL)
  );
}

