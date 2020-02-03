import { VSCodeGlobals } from "./VSCodeGlobals";
import * as vscode from 'vscode';

const IS_GREETED = 'doki.theme.greeted';

export function attemptToGreetUser() {
    const greeted = VSCodeGlobals.globalState.get(IS_GREETED);
    if(!greeted) {
        const welcomPanel = vscode.window.createWebviewPanel(
            'dokiWelcomeWindow',
            'The Doki Theme',
            vscode.ViewColumn.Active,
            {}
        );

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
                TODO
            </div>
            <img class="sticker" src="https://raw.githubusercontent.com/cyclic-reference/doki-theme-jetbrains/master/themes/definitions/literature/monika/light/just_monika_joy.png" />
        </body>
        </html>`;
        
        VSCodeGlobals.globalState.update(IS_GREETED, true);
    }
}