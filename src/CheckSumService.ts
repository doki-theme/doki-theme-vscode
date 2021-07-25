import path from "path";
import vscode from "vscode";
import fs from "fs";
import crypto from "crypto";
import { appDirectory, workbenchDirectory } from "./ENV";

const productFile = path.join(appDirectory, "product.json");
const originalProductFile = `${productFile}.orig.${vscode.version}`;

const outDirectory = path.resolve(workbenchDirectory, '..', '..');

export const fixCheckSums = () => {
  const product: any = require(productFile);
  const checksumChanged = Object.entries(product.checksums).reduce(
    (didChange, entry) => {
      const [filePath, currentChecksum] = entry;
      const checksum = computeChecksum(
        path.join(outDirectory, ...filePath.split("/"))
      );
      if (checksum !== currentChecksum) {
        product.checksums[filePath] = checksum;
        return true;
      }

      return didChange;
    },
    false
  );

  if (checksumChanged) {
    const json = JSON.stringify(product, null, "\t");
    try {
      if (!fs.existsSync(originalProductFile)) {
        fs.renameSync(productFile, originalProductFile);
      }
      fs.writeFileSync(productFile, json, { encoding: "utf8" });
    } catch (err) {
      console.error(err);
    }
  }
};

export const restoreChecksum = () => {
  try {
    if (fs.existsSync(originalProductFile)) {
      fs.unlinkSync(productFile);
      fs.renameSync(originalProductFile, productFile);
    }
  } catch (err) {
    console.error(err);
  }
};

function computeChecksum(file: string) {
  const contents = fs.readFileSync(file);
  return crypto
    .createHash("md5")
    .update(contents)
    .digest("base64")
    .replace(/=+$/, "");
}

export function cleanupOrigFiles() {
  // Remove all old backup files that aren't related to the current version
  // of VSCode anymore.
  const oldOrigFiles = fs
    .readdirSync(appDirectory)
    .filter((file) => /\.orig\./.test(file))
    .filter((file) => !file.endsWith(vscode.version));
  for (const file of oldOrigFiles) {
    fs.unlinkSync(path.join(appDirectory, file));
  }
}
