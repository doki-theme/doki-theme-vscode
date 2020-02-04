import { VSCodeGlobals } from "./VSCodeGlobals";
import * as vscode from 'vscode';
import * as path from 'path';

const IS_GREETED = 'doki.theme.greeted';

export function attemptToGreetUser(context: vscode.ExtensionContext) {
    const greeted = false;
    // const greeted = VSCodeGlobals.globalState.get(IS_GREETED);
    if(!greeted) {
        const welcomPanel = vscode.window.createWebviewPanel(
            'dokiWelcomeWindow',
            'The Doki Theme',
            vscode.ViewColumn.Active,
            {}
        );

        const onDiskPath = vscode.Uri.file(
            path.join(context.extensionPath, 'src', 'assets', 'heart.png')
          );
        welcomPanel.iconPath = onDiskPath;
        welcomPanel.webview.html = `<!DOCTYPE html>
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
            <h2>The Doki Theme</h2>
            <div>
                <p>
                    Thank You for choosing <strong>The Doki Theme</strong>!<br/>
                    Since it is your first time, here is an overview of the plugins features.
                </p>
                <h2>Themes!</h2>
                <h2>Stickers!</h2>
                <h2>Icons!</h2>
                <h2>More!<h2>
                <div>
                </div>
            </div>
            <img class="sticker" src="https://raw.githubusercontent.com/cyclic-reference/doki-theme-jetbrains/master/themes/definitions/literature/monika/light/just_monika_joy.png" />
        </body>
        </html>`;
        
        VSCodeGlobals.globalState.update(IS_GREETED, true);
    }
}