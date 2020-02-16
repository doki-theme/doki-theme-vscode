import * as vscode from 'vscode';
import * as path from 'path';
import ChangelogHtml from "./ChangelogHtml";

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
        context,
        welcomPanel
    );
}

export function buildWebviewHtml(
    content: string,
    context: vscode.ExtensionContext,
    panel: vscode.WebviewPanel
): string {
    const monikaUrl =
    panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'assets', 'just_monika.png'))
    );
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>The Doki Theme</title>
            <style>
            .sticker {
                position: absolute;
                right: 0;
                bottom: 0;
            }
            </style>
        </head>
        <body>
            ${content}
            <img class="sticker" src="${monikaUrl}" />
        </body>
        </html>`;
}

export function getWebviewIcon(context: vscode.ExtensionContext) {
    return vscode.Uri.file(path.join(context.extensionPath, 'assets', 'heart.png'));
}
