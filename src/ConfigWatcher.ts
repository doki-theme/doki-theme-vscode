import * as vscode from "vscode";
import { attemptToInstallSticker, attemptToInstallWallpaper, getCurrentThemeAndSticker } from "./ThemeManager";

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
    const { sticker } = getCurrentThemeAndSticker();
    const newBoiConfig = vscode.workspace.getConfiguration(CONFIG_NAME);

    const stickerInstall =
      newBoiConfig.get(CONFIG_STICKER) !==
        currentConfig.get(CONFIG_STICKER) ?
        attemptToInstallSticker(sticker.sticker, extensionContext) :
        Promise.resolve();

    const backgroundChanged = newBoiConfig.get(CONFIG_BACKGROUND) !==
      currentConfig.get(CONFIG_BACKGROUND);
    const wallpaperChanged = newBoiConfig.get(CONFIG_WALLPAPER) !==
      currentConfig.get(CONFIG_WALLPAPER);
    const anchorChanged = newBoiConfig.get(CONFIG_BACKGROUND_ANCHOR) !==
      currentConfig.get(CONFIG_BACKGROUND_ANCHOR);
    const wallpaperInstall =
      backgroundChanged || wallpaperChanged || anchorChanged ?
        attemptToInstallWallpaper(sticker.sticker, extensionContext) :
        Promise.resolve();

    const installJerbs: Promise<any>[] = [
      stickerInstall,
      wallpaperInstall,
    ];
    Promise.all(installJerbs)
      .then(() => {
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
      })
      .catch(error => {
        console.error("Unable to install custom assets for reasons", error);
        vscode.window
          .showInformationMessage(
            `Oh no, I couldn't update your custom assets!\n Try again, please.`,
          )
      });
  });

