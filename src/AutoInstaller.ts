import * as vscode from "vscode";
import { fixCheckSums } from "./CheckSumService";
import { DokiTheme, DokiSticker } from "./DokiTheme";
import { getHideIndex, getStickerIndex, getWallpaperIndex, InstallStatus, installStickers, readCSS } from "./StickerService";
import { getCurrentThemeAndSticker, handleInstallFailure, handleInstallMessage, showInstallNotification, showNetworkErrorMessage } from "./ThemeManager";

const previousVersionKey = "doki.vscode.version"
const stickerInstallKey = "doki.sticker.restore"
const wallpaperInstallKey = "doki.wallpaper.restore"
const watermarkKey = "doki.watermark.restore"

enum AutoInstallStatus {
    LUL_DUNNO, NOT_INSTALLED, INSTALLED
}

export const attemptToPerformAutoInstall = (
    context: vscode.ExtensionContext,
) => {
    const storedVSCodeVersion: string | undefined = context.globalState.get(previousVersionKey);
    if (!storedVSCodeVersion) {
        storeFirstConfig(context);
    } else if (isVersionDifferent(storedVSCodeVersion)) {
        restoreInstallation(context);
    }
};

function isVersionDifferent(
    storedVSCodeVersion: string,
): boolean {
    return storedVSCodeVersion !== vscode.version;
}

function storeFirstConfig(context: vscode.ExtensionContext) {
    saveNewVersion(context);

    const vscodeCSS = readCSS();
    const { sticker } = getCurrentThemeAndSticker();
    const isStickerInstalled = getStickerIndex(vscodeCSS) > -1;
    if (isStickerInstalled) {
        saveStickerConfig(sticker, context);
    } else {
        clearStickerConfig(context)
    }

    const isWallpaperInstalled = getWallpaperIndex(vscodeCSS) > -1;
    if (isWallpaperInstalled) {
        saveWallpaperConfig(sticker, context);
    } else {
        clearWallpaperConfig(context)
    }

    const isWatermarkHidden = getHideIndex(vscodeCSS) > -1;
    if (isWatermarkHidden) {
        saveHiddenWatermarkConfig(context);
    } else {
        clearWatermarkConfig(context)
    }
}

function saveNewVersion(context: vscode.ExtensionContext) {
    context.globalState.update(previousVersionKey, vscode.version);
}

export function restoreInstallation(
    context: vscode.ExtensionContext,
) {
    saveNewVersion(context);
    const stickerInstallStatus = autoInstallAsset(stickerInstallKey, context);
    const wallpaperInstallStatus = autoInstallAsset(wallpaperInstallKey, context);
    const hideWaterMarkStatus = autoInstallAsset(watermarkKey, context);
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Please wait, restoring installed assets.`,
        cancellable: false,
    }, () => {
        return Promise.all([
            stickerInstallStatus,
            wallpaperInstallStatus,
            hideWaterMarkStatus,
        ]).then(installStatuses => {
            const { theme: dokiTheme } = getCurrentThemeAndSticker();
            const allWorked = installStatuses.reduce((accum, status) =>
                accum && (status == InstallStatus.INSTALLED ||
                    status === InstallStatus.NOT_INSTALLED), true);
            if (allWorked) {
                fixCheckSums();
                const message = `Assets Restored! ${handleInstallMessage}`;
                showInstallNotification(message)
            } else if (
                !installStatuses.find(status => status === InstallStatus.NETWORK_FAILURE)
            ) {
                showNetworkErrorMessage(dokiTheme)
            } else if (
                !installStatuses.find(status => status === InstallStatus.FAILURE)
            ) {
                handleInstallFailure(context, dokiTheme);
            }
        });
    });
}

function autoInstallAsset(
    assetKey: string,
    context: vscode.ExtensionContext
): Promise<InstallStatus> {
    const wasTheAssetInstalledYo = wasAssetInstalled(assetKey, context)
    if (wasTheAssetInstalledYo) {
        const {
            sticker,
        }: RestoreConfig = JSON.parse(context.globalState.get(stickerInstallKey) as string);
        return installStickers(sticker.sticker, context);
    } else {
        return Promise.resolve(InstallStatus.NOT_INSTALLED);
    }
}

export function saveStickerConfig(
    sticker: DokiSticker,
    context: vscode.ExtensionContext,
) {
    context.globalState.update(
        stickerInstallKey, createAssetRestoreConfig(sticker)
    );
}

export function saveWallpaperConfig(
    sticker: DokiSticker,
    context: vscode.ExtensionContext,
) {
    context.globalState.update(
        wallpaperInstallKey, createAssetRestoreConfig(sticker)
    )
}

export function saveHiddenWatermarkConfig(context: vscode.ExtensionContext) {
    context.globalState.update(
        watermarkKey, "是的"
    )
}

function clearStickerConfig(context: vscode.ExtensionContext) {
    context.globalState.update(stickerInstallKey, AutoInstallStatus.NOT_INSTALLED);
}
function clearWallpaperConfig(context: vscode.ExtensionContext) {
    context.globalState.update(wallpaperInstallKey, AutoInstallStatus.NOT_INSTALLED);
}
function clearWatermarkConfig(context: vscode.ExtensionContext) {
    context.globalState.update(watermarkKey, AutoInstallStatus.NOT_INSTALLED);
}

export function clearAssetConfig(
    context: vscode.ExtensionContext,
) {
    clearStickerConfig(context);
    clearWallpaperConfig(context);
    clearWatermarkConfig(context);
}

type RestoreConfig = {
    sticker: DokiSticker;
}

function createAssetRestoreConfig(sticker: DokiSticker): string {
    return JSON.stringify(
        {
            sticker
        } as RestoreConfig
    )
}

function wasAssetInstalled(
    assetKey: string,
    context: vscode.ExtensionContext,
): boolean {
    const assetConfig = context.globalState.get(assetKey)
    return assetConfig !== AutoInstallStatus.NOT_INSTALLED &&
        typeof assetConfig === 'string';
}

