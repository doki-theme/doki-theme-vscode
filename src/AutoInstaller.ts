import * as vscode from "vscode";
import { fixCheckSums } from "./CheckSumService";
import { DEFAULT_THEME_ID, DokiSticker, DokiTheme, StickerType } from "./DokiTheme";
import DokiThemeDefinitions from "./DokiThemeDefinitions";
import { StickerInstallPayload } from "./extension";
import { getHideIndex, getStickerIndex, getWallpaperIndex, hideWaterMark, InstallStatus, installStickers, installWallPaper, readCSS } from "./StickerService";
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
    const { sticker, theme } = getCurrentThemeAndSticker();
    const isStickerInstalled = getStickerIndex(vscodeCSS) > -1;
    if (isStickerInstalled) {
        saveStickerConfig({
            sticker,
            themeId: theme.id
        }, context);
    } else {
        clearStickerConfig(context)
    }

    const isWallpaperInstalled = getWallpaperIndex(vscodeCSS) > -1;
    if (isWallpaperInstalled) {
        saveWallpaperConfig({
            sticker,
            themeId: theme.id
        }, context);
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
    const stickerInstallStatus = autoInstallAsset(stickerInstallKey, context, installStickers);
    const wallpaperInstallStatus = autoInstallAsset(wallpaperInstallKey, context, installWallPaper);
    const hideWaterMarkStatus = autoInstallAsset(watermarkKey, context, () => hideWaterMark());
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
                fixCheckSums(context);
                const message = `Assets Restored! ${handleInstallMessage}`;
                showInstallNotification(message)
            } else if (
                installStatuses.find(status => status === InstallStatus.NETWORK_FAILURE)
            ) {
                showNetworkErrorMessage(dokiTheme)
            } else if (
                installStatuses.find(status => status === InstallStatus.FAILURE)
            ) {
                handleInstallFailure(context, dokiTheme);
            }
        });
    });
}

function autoInstallAsset(
    assetKey: string,
    context: vscode.ExtensionContext,
    assetInstaller: (
        stickerInstallPayload: StickerInstallPayload,
        context: vscode.ExtensionContext,
    ) => Promise<InstallStatus>
): Promise<InstallStatus> {
    const wasTheAssetInstalledYo = wasAssetInstalled(assetKey, context)
    if (wasTheAssetInstalledYo) {
        const {
            sticker,
            themeId,
        }: RestoreConfig = JSON.parse(context.globalState.get(assetKey) as string);
        const { theme } = getCurrentThemeAndSticker()
        const usableThemeId = themeId || theme.id;
        const def = DokiThemeDefinitions.find(theme => theme.themeDefinition.information.id === usableThemeId)
            || DokiThemeDefinitions.find(theme => theme.themeDefinition.information.id === DEFAULT_THEME_ID)!;
        return assetInstaller({
            sticker: sticker.sticker,
            theme: new DokiTheme(def.themeDefinition),
        }, context);
    } else {
        return Promise.resolve(InstallStatus.NOT_INSTALLED);
    }
}

export function saveStickerConfig(
    restoreConfig: RestoreConfig,
    context: vscode.ExtensionContext,
) {
    context.globalState.update(
        stickerInstallKey, createAssetRestoreConfig(restoreConfig)
    );
}

export function saveWallpaperConfig(
    restoreConfig: RestoreConfig,
    context: vscode.ExtensionContext,
) {
    context.globalState.update(
        wallpaperInstallKey, createAssetRestoreConfig(restoreConfig)
    )
}

export function saveHiddenWatermarkConfig(context: vscode.ExtensionContext) {
    const bestSticker: DokiSticker = {
        sticker: {
            anchoring: 'right',
            name: "Zero Two",
            path: "Is best girl",
        },
        type: StickerType.DEFAULT,
    }
    context.globalState.update(
        watermarkKey, createAssetRestoreConfig({
            sticker: bestSticker,
            themeId: DEFAULT_THEME_ID,
        }),
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

export type RestoreConfig = {
    sticker: DokiSticker;
    themeId: string;
}

function createAssetRestoreConfig(stickerInstallPayload: RestoreConfig): string {
    return JSON.stringify(stickerInstallPayload)
}

function wasAssetInstalled(
    assetKey: string,
    context: vscode.ExtensionContext,
): boolean {
    const assetConfig = context.globalState.get(assetKey)
    return assetConfig !== AutoInstallStatus.NOT_INSTALLED &&
        typeof assetConfig === 'string';
}

