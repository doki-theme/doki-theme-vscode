import * as vscode from "vscode";
import { fixCheckSums } from "./CheckSumService";
import { InstallStatus } from "./StickerService";
import { attemptToInstallSticker, attemptToInstallWallpaper, getCurrentThemeAndSticker, handleInstallFailure } from "./ThemeManager";

export const CONFIG_NAME = "doki";
export const CONFIG_STICKER = "sticker.path";
export const CONFIG_BACKGROUND = "background.path";
export const CONFIG_WALLPAPER = "wallpaper.path";
export const CONFIG_BACKGROUND_ANCHOR = "background.anchor";

let currentConfig = vscode.workspace.getConfiguration(CONFIG_NAME);

export const watchConfigChanges = (
  extensionContext: vscode.ExtensionContext
): vscode.Disposable =>
  vscode.workspace.onDidChangeConfiguration(() => {
    const { sticker, theme } = getCurrentThemeAndSticker();
    const newBoiConfig = vscode.workspace.getConfiguration(CONFIG_NAME);

    const stickerInstall =
      newBoiConfig.get(CONFIG_STICKER) !==
        currentConfig.get(CONFIG_STICKER) ?
        attemptToInstallSticker(sticker.sticker, extensionContext) :
        Promise.resolve(InstallStatus.NOT_INSTALLED);

    const backgroundChanged = newBoiConfig.get(CONFIG_BACKGROUND) !==
      currentConfig.get(CONFIG_BACKGROUND);
    const wallpaperChanged = newBoiConfig.get(CONFIG_WALLPAPER) !==
      currentConfig.get(CONFIG_WALLPAPER);
    const anchorChanged = newBoiConfig.get(CONFIG_BACKGROUND_ANCHOR) !==
      currentConfig.get(CONFIG_BACKGROUND_ANCHOR);
    const wallpaperInstall =
      backgroundChanged || wallpaperChanged || anchorChanged ?
        attemptToInstallWallpaper(sticker.sticker, extensionContext) :
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
          fixCheckSums();
          vscode.window
            .showInformationMessage(
              `Custom Assets installed!\n Please restart your VSCode`,
              { title: "Restart VSCode" }
            )
            .then((item) => {
              if (item) {
                vscode.commands.executeCommand("workbench.action.reloadWindow");
              }
            });
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

