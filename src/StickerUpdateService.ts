import * as vscode from 'vscode';
import { getCurrentTheme } from './ThemeManager';

export const attemptToUpdateSticker = (context: vscode.ExtensionContext) => {
  const currentTheme = getCurrentTheme();
  console.log(currentTheme.name, context.globalStoragePath);
};