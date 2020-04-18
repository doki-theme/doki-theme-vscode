import * as vscode from 'vscode';
import { getCurrentTheme } from './ThemeManager';
import { performGet } from './RESTClient';
import { installSticker } from './StickerService';
import { DokiTheme } from './DokiTheme';

const fetchRemoteChecksum = async (currentTheme: DokiTheme) => {
  const checkSumInputStream = await performGet('https://doki.assets.acari.io/stickers/vscode/reZero/rem/rem.png.checksum.txt');
  return checkSumInputStream.setEncoding('utf8').read();
};

const fetchLocalChecksum = async (currentTheme: DokiTheme) => {
  return 'yeet!';  
};

export const attemptToUpdateSticker = async (context: vscode.ExtensionContext) => {
  const currentTheme = getCurrentTheme();
  console.log(currentTheme.name, context.globalStoragePath);

  try {
    const remoteChecksum = await fetchRemoteChecksum(currentTheme);
    const localChecksum = await fetchLocalChecksum(currentTheme);
    if(remoteChecksum !== localChecksum) {
      console.log('sticker is different');
      
      // installSticker(currentTheme, context);
    }    
  } catch(e) {
    console.error('Unable to check for updates', e);
  }
};
