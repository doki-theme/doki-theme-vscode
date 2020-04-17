import * as vscode from 'vscode';
import { getCurrentTheme } from './ThemeManager';
import { performGet } from './RESTClient';

export const attemptToUpdateSticker = (context: vscode.ExtensionContext) => {
  const currentTheme = getCurrentTheme();
  console.log(currentTheme.name, context.globalStoragePath);
  performGet('https://doki.assets.acari.io/stickers/vscode/reZero/rem/rem.png.checksum.txt').then(result => {
    console.log('I got this thing', result.setEncoding('utf8').read());
  }).catch(er => {
    console.log("Oh shit this", er);
    
  });
};