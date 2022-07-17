import path from "path";
import jimp from "jimp";
import {walkDir} from "doki-build-source";
import {chunk} from "lodash";

console.log("Preparing to smolify assets generation.");

async function ensureAssetIsSmol(screenPath: string) {
  return new Promise((resolve, reject) => {
    jimp.read(screenPath, function (err, img) {
      console.log(`Read wallpaper ${screenPath}`);
      if (err) {
        reject(err)
      } else {
        const width = img.getWidth();
        const height = img.getHeight();
        const MAX_WIDTH = 1000;
        if (width <= MAX_WIDTH) {
          console.log(`Didn't need to do anything for ${screenPath}`);
          resolve()
        } else {
          const newWidth = MAX_WIDTH;
          const newHeight = MAX_WIDTH * (height / width);
          img.resize(newWidth, newHeight)
            .write(screenPath, (err) => {
              if (err) {
                reject(err)
              } else {
                console.log(`Successfully smolified ${screenPath}`);
                resolve()
              }
            })
        }
      }
    })
  })
}

const assetDirectory = path.resolve('..', 'screenshots');
walkDir(assetDirectory)
  .then(paths => paths.filter(filePath => filePath.endsWith('.png')))
  .then(async screensToSmolify => {
    return Promise.all(
    chunk(screensToSmolify, 10).map(async chunkedScreens => {
      for (const screenPath of chunkedScreens) {
        await ensureAssetIsSmol(screenPath);
      }
    })
    )
  })
  .then(() => {
    console.log("Smolification Complete!");
  });
