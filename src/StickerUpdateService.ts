import * as vscode from "vscode";
import { performGet } from "./RESTClient";
import path from "path";
import fs from "fs";
import { URL } from 'url';
import crypto from "crypto";
import {
  VSCODE_ASSETS_URL,
  BACKGROUND_ASSETS_URL,
  isWSL,
  workbenchDirectory,
  WALLPAPER_ASSETS_URL,
  ACTUAL_BACKGROUND_ASSETS_URL,
} from "./ENV";
import { DokiStickers } from "./StickerService";
import { DokiThemeDefinition, Sticker, StickerInstallPayload } from "./extension";
import { CONFIG_BACKGROUND, CONFIG_BACKGROUND_ANCHOR, CONFIG_NAME, CONFIG_STICKER, CONFIG_WALLPAPER } from "./ConfigWatcher";
import { DokiTheme, ZERO_TWO_OBSIDIAN_ID } from "./DokiTheme";

function loadImageBase64FromFileProtocol(url: string): string {
  const fileUrl = new URL(url);
  const imageBuffer = fs.readFileSync(fileUrl);
  const imageExtensionName = path.extname(fileUrl.pathname).substr(1);

  return `data:image/${imageExtensionName};base64,${imageBuffer.toString('base64')}`;
}

export const forceUpdateSticker = async (
  context: vscode.ExtensionContext,
  stickerInstallPayload: StickerInstallPayload,
): Promise<DokiStickers> =>
  _attemptToUpdateSticker(context, stickerInstallPayload, forceUpdateAsset);

export const attemptToUpdateSticker = async (
  context: vscode.ExtensionContext,
  stickerInstallPayload: StickerInstallPayload
): Promise<DokiStickers> =>
  _attemptToUpdateSticker(context, stickerInstallPayload, attemptToUpdateAsset);

const _attemptToUpdateSticker = async (
  context: vscode.ExtensionContext,
  { sticker: currentSticker, theme }: StickerInstallPayload,
  assetUpdater: (
    remoteStickerUrl: string,
    localStickerPath: string,
    context: vscode.ExtensionContext
  ) => Promise<void>
): Promise<DokiStickers> => {
  const remoteStickerUrl = `${VSCODE_ASSETS_URL}${stickerPathToUrl(
    currentSticker
  )}`;
  const remoteWallpaperUrl = `${WALLPAPER_ASSETS_URL}${wallpaperPathToUrl(
    currentSticker
  )}`;
  const backgroundBase = requiresRealBackground(theme) ?
    ACTUAL_BACKGROUND_ASSETS_URL : BACKGROUND_ASSETS_URL;
  const remoteBackgroundUrl =
    `${backgroundBase}${wallpaperPathToUrl(
      currentSticker
    )}`;
  const localStickerPath = resolveLocalStickerPath(currentSticker, context);
  const localWallpaperPath = resolveLocalWallpaperPath(currentSticker, context);
  const localBackgroundPath = resolveLocalBackgroundPath(
    currentSticker,
    context
  );
  await Promise.all([
    assetUpdater(remoteStickerUrl, localStickerPath, context),
    assetUpdater(remoteWallpaperUrl, localWallpaperPath, context),
    assetUpdater(remoteBackgroundUrl, localBackgroundPath, context),
  ]);

  const config = vscode.workspace.getConfiguration(CONFIG_NAME);

  const customSticker: string = config.get(CONFIG_STICKER) + '';
  const customBackground: string = config.get(CONFIG_BACKGROUND) + '';
  const customWallpaper: string = config.get(CONFIG_WALLPAPER) + '';
  return {
    stickerDataURL: createCssDokiAssetUrl(
      fs.existsSync(customSticker) ? customSticker : localStickerPath
    ),
    backgroundImageURL: createCssDokiAssetUrl(
      fs.existsSync(customBackground) ? customBackground : localBackgroundPath
    ),
    wallpaperImageURL: createCssDokiAssetUrl(
      fs.existsSync(customWallpaper) ? customWallpaper : localWallpaperPath
    ),
    backgroundAnchoring: config.get(CONFIG_BACKGROUND_ANCHOR) ||
      currentSticker.anchoring,
  };
};

async function attemptToUpdateAsset(
  remoteStickerUrl: string,
  localStickerPath: string,
  context: vscode.ExtensionContext
) {
  if (hasCheckedToday(remoteStickerUrl, context)) {
    return;
  }

  await forceUpdateAsset(remoteStickerUrl, localStickerPath);
}

export class NetworkError extends Error { }

async function forceUpdateAsset(
  remoteStickerUrl: string,
  localStickerPath: string
) {
  try {
    if (await shouldDownloadNewAsset(remoteStickerUrl, localStickerPath)) {
      await installAsset(remoteStickerUrl, localStickerPath);
    }
  } catch (e) {
    console.error(`Unable to get remote asset ${remoteStickerUrl}!`, e);
    throw new NetworkError();
  }
}

const fetchRemoteChecksum = async (remoteAssetUrl: string) => {
  const checksumUrl = `${remoteAssetUrl}.checksum.txt`;
  console.log(`Fetching resource checksum: ${checksumUrl}`);
  const checkSumInputStream = await performGet(checksumUrl);
  return checkSumInputStream.setEncoding("utf8").read();
};

const resolveLocalStickerPath = (
  currentSticker: Sticker,
  context: vscode.ExtensionContext
): string => {
  const safeStickerPath = stickerPathToUrl(currentSticker);
  return path.join(getStoragePath(context), "stickers", safeStickerPath);
};

function getWSLStoragePath(): string {
  const appDataDirectory = "AppData";
  const userAppDataIndex = workbenchDirectory.indexOf(appDataDirectory);
  if (userAppDataIndex > -1) {
    const windowsGlobalStorageDirectory = path.resolve(
      workbenchDirectory.substring(
        0,
        userAppDataIndex + appDataDirectory.length
      ),
      "Roaming",
      "Code",
      "User",
      "globalStorage",
      "unthrottled.doki-theme"
    );
    try {
      if (!fs.existsSync(windowsGlobalStorageDirectory)) {
        fs.mkdirSync(windowsGlobalStorageDirectory, { recursive: true });
      }
      return windowsGlobalStorageDirectory;
    } catch (e) {
      console.error("Unable to create roaming directory", e);
    }
  }
  throw Error("Unable to set up WSL asset directory!");
}

function getStoragePath(context: vscode.ExtensionContext) {
  return isWSL() ? getWSLStoragePath() : context.globalStoragePath;
}

const resolveLocalWallpaperPath = (
  currentSticker: Sticker,
  context: vscode.ExtensionContext
): string => {
  const safeStickerPath = wallpaperPathToUrl(currentSticker);
  return path.join(getStoragePath(context), "wallpapers", safeStickerPath);
};
const resolveLocalBackgroundPath = (
  currentSticker: Sticker,
  context: vscode.ExtensionContext
): string => {
  const safeStickerPath = wallpaperPathToUrl(currentSticker);
  return path.join(getStoragePath(context), "backgrounds", safeStickerPath);
};

const createCssDokiAssetUrl = (localAssetPath: string): string => {
  return loadImageBase64FromFileProtocol(`file://${cleanPathToUrl(localAssetPath)}`);
};

function cleanPathToUrl(stickerPath: string) {
  const scrubbedUrl = stickerPath.replace(/\\/g, "/");
  const unEncodedUrl = isWSL() ? scrubbedUrl.replace("/mnt/c", "c:") : scrubbedUrl;
  const encodedUrl = encodeURI(unEncodedUrl).replace(/[!'()*]/g, escape);
  return encodedUrl;
}

function stickerPathToUrl(currentSticker: Sticker) {
  const stickerPath = currentSticker.path;
  return cleanPathToUrl(stickerPath);
}

function wallpaperPathToUrl(currentSticker: Sticker) {
  const stickerPath = `/${currentSticker.name}`;
  return cleanPathToUrl(stickerPath);
}

function createChecksum(data: Buffer | string): string {
  return crypto.createHash("md5").update(data).digest("hex");
}

const calculateFileChecksum = (filePath: string): string => {
  const fileRead = fs.readFileSync(filePath);
  return createChecksum(fileRead);
};

const fetchLocalChecksum = async (localSticker: string) => {
  return fs.existsSync(localSticker)
    ? calculateFileChecksum(localSticker)
    : "File not downloaded, bruv.";
};

const shouldDownloadNewAsset = async (
  remoteAssetUrl: string,
  localStickerPath: string
): Promise<boolean> => {
  const remoteChecksum = await fetchRemoteChecksum(remoteAssetUrl);
  const localChecksum = await fetchLocalChecksum(localStickerPath);
  return remoteChecksum !== localChecksum;
};

const downloadRemoteAsset = async (
  remoteAssetUrl: string,
  localDestination: string
) => {
  const parentDirectory = path.dirname(localDestination);
  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory, { recursive: true });
  }
  console.log(`Downloading remote asset: ${remoteAssetUrl}`);
  const stickerInputStream = await performGet(remoteAssetUrl);
  console.log("Remote asset Downloaded!");
  fs.writeFileSync(localDestination, stickerInputStream.read());
};

async function installAsset(
  remoteAssetUrl: string,
  localAssetPath: string
): Promise<void> {
  await downloadRemoteAsset(remoteAssetUrl, localAssetPath);
}

const DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

function hasCheckedToday(
  remoteAssetUrl: string,
  context: vscode.ExtensionContext
): boolean {
  const assetCheckKey = `check.${remoteAssetUrl}`;
  const checkDate = context.globalState.get(assetCheckKey) as
    | number
    | undefined;
  const meow = Date.now();
  if (!checkDate) {
    context.globalState.update(assetCheckKey, meow);
    return false;
  } else if (meow - checkDate >= DAY_IN_MILLIS) {
    context.globalState.update(assetCheckKey, meow);
    return false;
  } else {
    return true;
  }
}

function requiresRealBackground(theme: DokiTheme) {
  return theme.id === ZERO_TWO_OBSIDIAN_ID;
}
