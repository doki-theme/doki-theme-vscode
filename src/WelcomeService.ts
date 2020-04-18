import { VSCodeGlobals } from "./VSCodeGlobals";
import * as vscode from 'vscode';
import { getWebviewIcon, buildWebviewHtml } from "./ChangelogService";
import { SCREENSHOT_ASSETS_URL } from "./ENV";

const IS_GREETED = 'doki.theme.greeted';

export function attemptToGreetUser(context: vscode.ExtensionContext) {
    const greeted = VSCodeGlobals.globalState.get(IS_GREETED);
    if(!greeted) {
        const welcomePanel = vscode.window.createWebviewPanel(
            'dokiWelcomeWindow',
            'The Doki Theme',
            vscode.ViewColumn.Active,
            {}
        );

        welcomePanel.iconPath = getWebviewIcon(context);
        welcomePanel.webview.html = buildWebviewHtml(`
            <div>
            <div style="max-width: 500px">
            <h2>The Doki Theme</h2>
            <div>
                <p>
                    Thank You for choosing <strong>The Doki Theme</strong>!<br/>
                    Since it is your first time, here is an overview of the plugins features.
                </p>
                <h2>Themes!</h2>
                <p>
                    With over 10 themes (light and dark) I think you will be able to find your favorite.
                    You can even find one that fits your mood for the day.
                </p>
                <p>
                    You can choose themes from the following Doki-Doki Theme Suites:
                </p>
                <ul>
                    <li>Doki-Doki Literature Club</li>
                    <li>Re:Zero</li>
                    <li>Kill La Kill</li>
                    <li>KonoSuba</li>
                </ul>
                <h2>Stickers!</h2>
                    <p>
                        Possibly the best feature of this plugin! 
                        Put a cute little sticker in the corner of your IDE.
                        As a bonus, you even get a themed background when all your editor windows become closed!
                    </p>
                 <h3>Important!</h3>
                 <p>
                    Unfortunately, I am unable to provide the cute stickers without having to corrupt your VS-Code installation.
                    I have to make changes to a CSS file to support this feature.
                </p>
                 <p>
                    If I am unable to install your requested sticker, I will pull up a help menu that will provide 
                    you with more information. 
                </p>
                <p>
                    <strong>This also means that you have to use the 'Remove Sticker' action before uninstalling the extension if you want the stickers gone.</strong>
                </p>
                <h2>More!</h2>
                <p>
                    Do you also develop using JetBrain's products (Intellij, CLion, Pycharm, etc)? 
                    Then be sure to install <a href="https://plugins.jetbrains.com/plugin/10804-doki-doki-literature-club-theme">the JetBrain's Doki Theme plugin as well!</a>
                </p>
                </div>
            </div>
            <div>
               <h2>Sample Usage</h2>
                <img 
                style="z-index: 9001;"
                src="${SCREENSHOT_ASSETS_URL}/doki-theme-vscode-usage.gif" alt="Theme Usage"/>
                Steps Demonstrated:
                <ol>
                    <li>Choose Color Theme</li>
                    <li>Enable Theme's Stickers</li>
                    <li>Reload/Restart VSCode</li>
                    <li>Code!</li>
                </ol> 
            </div>
            </div>
            `, context, welcomePanel);
        
        VSCodeGlobals.globalState.update(IS_GREETED, true);
    }
}