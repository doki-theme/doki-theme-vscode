import { VSCodeGlobals } from "./VSCodeGlobals";
import * as vscode from 'vscode';
import { getWebviewIcon, buildWebviewHtml } from "./ChangelogService";

const IS_GREETED = 'doki.theme.greeted';

export function attemptToGreetUser(context: vscode.ExtensionContext) {
    // const greeted = false;
    const greeted = VSCodeGlobals.globalState.get(IS_GREETED);
    if(!greeted) {
        const welcomPanel = vscode.window.createWebviewPanel(
            'dokiWelcomeWindow',
            'The Doki Theme',
            vscode.ViewColumn.Active,
            {}
        );

        welcomPanel.iconPath = getWebviewIcon(context);
        welcomPanel.webview.html = buildWebviewHtml(`
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
            `, context, welcomPanel);
        
        VSCodeGlobals.globalState.update(IS_GREETED, true);
    }
}