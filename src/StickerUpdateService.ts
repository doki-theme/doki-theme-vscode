import * as vscode from "vscode";
import { getCurrentTheme } from "./ThemeManager";
import { performGet } from "./RESTClient";
import { DokiTheme } from "./DokiTheme";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { VSCODE_ASSETS_URL, isCodeServer } from "./ENV";
import { DokiStickers } from "./StickerService";

export const attemptToUpdateSticker = async (
  context: vscode.ExtensionContext,
  currentTheme: DokiTheme,
): Promise<DokiStickers> => {
  const remoteStickerUrl = `${VSCODE_ASSETS_URL}${stickerPathToUrl(
    currentTheme
  )}`;
  const remoteWallpaperUrl = `${VSCODE_ASSETS_URL}${wallpaperPathToUrl(
    currentTheme
  )}`;
  if (isCodeServer()) {
    return {
      stickerDataURL: remoteStickerUrl,
      backgroundImageURL: remoteWallpaperUrl,
    };
  }

  const localStickerPath = resolveLocalStickerPath(currentTheme, context);
  const localWallpaperPath = resolveLocalWallpaperPath(currentTheme, context);
  await Promise.all([
    attemptToUpdateAsset(remoteStickerUrl, localStickerPath),
    attemptToUpdateAsset(remoteWallpaperUrl, localWallpaperPath),
  ]);

  return {
    stickerDataURL: createCssDokiAssetUrl(localStickerPath),
    backgroundImageURL: createCssDokiAssetUrl(localWallpaperPath),
  };
};

async function attemptToUpdateAsset(
  remoteStickerUrl: string,
  localStickerPath: string
) {
  if (await isStickerNotCurrent(remoteStickerUrl, localStickerPath)) {
    await installAsset(remoteStickerUrl, localStickerPath);
  }
}

const fetchRemoteChecksum = async (remoteAssetUrl: string) => {
  const checksumUrl = `${remoteAssetUrl}.checksum.txt`;
  console.log(`Fetching resource checksum: ${checksumUrl}`);
  const checkSumInputStream = await performGet(checksumUrl);
  return checkSumInputStream.setEncoding("utf8").read();
};

const resolveLocalStickerPath = (
  currentTheme: DokiTheme,
  context: vscode.ExtensionContext
): string => {
  const safeStickerPath = stickerPathToUrl(currentTheme);
  return path.join(context.globalStoragePath, "stickers", safeStickerPath);
};

const resolveLocalWallpaperPath = (
  currentTheme: DokiTheme,
  context: vscode.ExtensionContext
): string => {
  const safeStickerPath = wallpaperPathToUrl(currentTheme);
  return path.join(context.globalStoragePath, "wallpapers", safeStickerPath);
};

const createCssDokiAssetUrl = (localAssetPath: string): string => {
  return `file://${cleanPathToUrl(localAssetPath)}`;
};

function cleanPathToUrl(stickerPath: string) {
  return stickerPath.replace(/\\/g, "/");
}

function stickerPathToUrl(currentTheme: DokiTheme) {
  const stickerPath = currentTheme.sticker.path;
  return cleanPathToUrl(stickerPath);
}

function wallpaperPathToUrl(currentTheme: DokiTheme) {
  const stickerPath = currentTheme.sticker.name;
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

const isStickerNotCurrent = async (
  remoteAssetUrl: string,
  localStickerPath: string
): Promise<boolean> => {
  try {
    const remoteChecksum = await fetchRemoteChecksum(remoteAssetUrl);
    const localChecksum = await fetchLocalChecksum(localStickerPath);
    return remoteChecksum !== localChecksum;
  } catch (e) {
    console.error("Unable to check for updates", e);
    return false;
  }
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
  console.log("Image Downloaded!");
  fs.writeFileSync(localDestination, stickerInputStream.read());
};

async function installAsset(
  remoteAssetUrl: string,
  localAssetPath: string
): Promise<boolean> {
  try {
    await downloadRemoteAsset(remoteAssetUrl, localAssetPath);
    return true;
  } catch (e) {
    console.error(`Unable to install asset ${remoteAssetUrl}!`, e);
  }
  return false;
}
