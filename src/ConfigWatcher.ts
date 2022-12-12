import * as vscode from "vscode";
import fs from 'fs';
import { fixCheckSums } from "./CheckSumService";
import { InstallStatus } from "./StickerService";
import { attemptToInstallSticker, attemptToInstallWallpaper, getCurrentThemeAndSticker, handleInstallFailure, handleInstallMessage, showInstallNotification } from "./ThemeManager";
import { StatusBarComponent } from "./StatusBar";

export const CONFIG_NAME = "doki";
export const CONFIG_STICKER = "sticker.path";
export const CONFIG_STICKER_CSS = "sticker.css";
export const CONFIG_BACKGROUND = "background.path";
export const CONFIG_WALLPAPER = "wallpaper.path";
export const CONFIG_WALLPAPER_ENABLED = "wallpaper.enabled";
export const CONFIG_BACKGROUND_ANCHOR = "background.anchor";
export const CONFIG_BACKGROUND_ENABLED = "background.enabled";
export const CONFIG_STATUS_BAR_NAME = "statusbar.name";

export const getConfig = () => vscode.workspace.getConfiguration(CONFIG_NAME)

let currentConfig = getConfig();


export const watchConfigChanges = (
  extensionContext: vscode.ExtensionContext
): vscode.Disposable =>
  vscode.workspace.onDidChangeConfiguration(() => {
    const { sticker, theme } = getCurrentThemeAndSticker();
    const newBoiConfig = vscode.workspace.getConfiguration(CONFIG_NAME);

    const statusBarName = newBoiConfig.get(CONFIG_STATUS_BAR_NAME);
    const statusBarConfigChanged = currentConfig.get(CONFIG_STATUS_BAR_NAME) !== statusBarName;
    if (statusBarConfigChanged && !!statusBarName && typeof statusBarName === 'string') {
      StatusBarComponent.setText(statusBarName);
    } else if (statusBarConfigChanged && !statusBarName) {
      const { theme } = getCurrentThemeAndSticker();
      StatusBarComponent.setText(theme.displayName);
    }

    const stickerChanged = newBoiConfig.get(CONFIG_STICKER) !==
      currentConfig.get(CONFIG_STICKER);
    const stickerCSSChanged = newBoiConfig.get(CONFIG_STICKER_CSS) !==
      currentConfig.get(CONFIG_STICKER_CSS);
    const isStickerFullPath = isFile(newBoiConfig.get(CONFIG_STICKER));
    const stickerInstall =
      (stickerChanged && isStickerFullPath) ||
        (stickerCSSChanged) ?
        attemptToInstallSticker({
          theme,
          sticker: sticker.sticker,
        }, extensionContext) :
        Promise.resolve(InstallStatus.NOT_INSTALLED);

    const backgroundConfig = newBoiConfig.get(CONFIG_BACKGROUND);
    const backgroundChanged = backgroundConfig !==
      currentConfig.get(CONFIG_BACKGROUND);
    const isBackgroundFullPath = isFile(backgroundConfig);
    const wallpaperConfig = newBoiConfig.get(CONFIG_WALLPAPER);
    const wallpaperChanged = wallpaperConfig !==
      currentConfig.get(CONFIG_WALLPAPER);
    const isWallPaperFullPath = isFile(wallpaperConfig);
    const anchorChanged = newBoiConfig.get(CONFIG_BACKGROUND_ANCHOR) !==
      currentConfig.get(CONFIG_BACKGROUND_ANCHOR);
    const wallpaperInstall =
      (backgroundChanged && (isBackgroundFullPath || !backgroundConfig)) ||
        (wallpaperChanged && (isWallPaperFullPath || !wallpaperConfig)) ||
        anchorChanged ?
        attemptToInstallWallpaper({
          theme,
          sticker: sticker.sticker,
        }, extensionContext) :
        Promise.resolve(InstallStatus.NOT_INSTALLED);

    const installJerbs = [
      stickerInstall,
      wallpaperInstall,
    ];
    Promise.all(installJerbs)
      .then((jerbResults) => {
        const hadFailure = jerbResults
          .reduce((didWork, jerbStatus) =>
            didWork || jerbStatus == InstallStatus.FAILURE, false);
        const hadSuccess = jerbResults
          .reduce((didWork, jerbStatus) =>
            didWork || jerbStatus == InstallStatus.INSTALLED, false);

        if (hadFailure) {
          handleInstallFailure(extensionContext, theme);
        } else if (hadSuccess) {
          fixCheckSums(extensionContext);
          const message = `Custom Asset(s) Installed! ${handleInstallMessage}`;
          showInstallNotification(message)
        }
        currentConfig = newBoiConfig
      })
      .catch(error => {
        console.error("Unable to install custom assets for reasons", error);
        vscode.window
          .showInformationMessage(
            `Oh no, I couldn't update your custom assets!\n Try again, please.`,
          )
      });
  });

function isFile(filePath: any) {
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
}

