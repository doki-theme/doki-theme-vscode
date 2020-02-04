import * as vscode from 'vscode';
import { getWebviewIcon, buildWebviewHtml } from "./ChangelogService";


export function showStickerSupportWindow(context: vscode.ExtensionContext) {
    const welcomPanel = vscode.window.createWebviewPanel(
        'dokiStickerHelp',
        'Doki Sticker Help',
        vscode.ViewColumn.Active,
        {}
    );
    welcomPanel.iconPath = getWebviewIcon(context);
    welcomPanel.webview.html = buildWebviewHtml(`
            <h2>Sticker Installation Help</h2>
            <div>
                <p>
                    Thank You for choosing <strong>The Doki Theme</strong>!<br/>
                    Since it is your first time, here is an overview of the plugins features.
                </p>
                <div>
                </div>
            </div>
            `);

}