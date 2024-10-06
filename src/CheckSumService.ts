import path from "path";
import vscode from "vscode";
import fs from "fs";
import crypto from "crypto";
import { appDirectory, workbenchDirectory } from "./ENV";
import { showChecksumFixHelp } from "./SupportService";

export const productFile = path.join(appDirectory, "product.json");
const originalProductFile = `${productFile}.orig.${vscode.version}`;

const outDirectory = path.resolve(workbenchDirectory, "..", "..");

export const fixCheckSums = (extensionContext: vscode.ExtensionContext) => {
  try {
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
        vscode.window
          .showErrorMessage(`Unable to remove [Unsupported] status!`, {
            title: "Show Help",
          })
          .then((item) => {
            if (item) {
              showChecksumFixHelp(extensionContext);
            }
          });
        console.error(err);
      }
    }
  } catch (e) {
    console.error(`Unable to fix checksum ${productFile}`, e)
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
    .createHash("sha256")
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
