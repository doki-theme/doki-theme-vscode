import * as vscode from 'vscode';
import * as path from 'path';
import ChangelogHtml from "./ChangelogHtml";
import { getCurrentThemeAndSticker } from './ThemeManager';

export function showChanglog(context: vscode.ExtensionContext) {
    const welcomPanel = vscode.window.createWebviewPanel(
        'dokiChangeLog',
        'Doki Theme Changelog',
        vscode.ViewColumn.Active,
        {}
    );
    welcomPanel.iconPath = getWebviewIcon(context);
    welcomPanel.webview.html = buildWebviewHtml(
        ChangelogHtml,
    );
}

export function buildWebviewHtml(
    content: string,
): string {
    const {sticker} = getCurrentThemeAndSticker();
    const stickerUrl =
    `https://doki.assets.unthrottled.io/stickers/jetbrains/v2${sticker.sticker.path}`;
    
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>The Doki Theme</title>
            <style>
            .sticker {
                position: fixed;
                right: 0;
                bottom: 0;
                z-index: 9001;
            }
            </style>
        </head>
        <body>
            ${content}
            <img class="sticker" src="${stickerUrl}" />
        </body>
        </html>`;
}

export function getWebviewIcon(context: vscode.ExtensionContext) {
    return vscode.Uri.file(path.join(context.extensionPath, 'assets', 'heart.png'));
}
