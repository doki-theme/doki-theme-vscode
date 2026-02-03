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
                    With over 60+ themes (light and dark) I think you will be able to find 
                    find best girl.
                </p>
                <p>
                    You can choose themes from the following Doki-Doki Theme Suites such as:
                </p>
                <ul>
                    <li>AzurLane</li>
                    <li>Blend S</li>
                    <li>Daily life with a monster girl</li>
                    <li>DanganRonpa</li>
                    <li>Darling in the Franxx</li>
                    <li>Doki-Doki Literature Club</li>
                    <li>Don't Toy With Me, Miss Nagatoro</li>
                    <li>EroManga Sensei</li>
                    <li>Fate</li>
                    <li>Future Diary</li>
                    <li>Gate</li>
                    <li>High School DxD</li>
                    <li>Jahy-sama Will Not Be Discouraged!</li>
                    <li>Kakegurui</li>
                    <li>Kill La Kill</li>
                    <li>KonoSuba</li>
                    <li>Love Live!</li>
                    <li>Lucky Star</li>
                    <li>Miss Kobayashi's Dragon Maid</li>
                    <li>Monogatari</li>
                    <li>NekoPara</li>
                    <li>Neon Genesis Evangelion</li>
                    <li>OreGairu</li>
                    <li>OreImo</li>
                    <li>Quintessential Quintuplets</li>
                    <li>Rascal does not dream of bunny girl senpai</li>
                    <li>Re:Zero</li>
                    <li>Steins Gate</li>
                    <li>Sword Art Online</li>
                    <li>Yuru Camp</li>
                </ul>
                <h2>Background Wallpaper & Stickers!</h2>
                    <p>
                        Possibly the best feature of this plugin! 
                        Decorate your visual studio code with a wallpaper of your favorite anime character.
                        In addition, put a cute little sticker in the corner of your IDE.
                        As a bonus, you even get a themed background when all your editor windows become closed!
                    </p>
                 <h3>Important!</h3>
                 <p>
                    Unfortunately, I am unable to provide the wallpapers/stickers without having to corrupt your VS-Code installation.
                    I have to make changes to a CSS file to support this feature.
                </p>
                 <p>
                    If I am unable to install your requested asset, I will pull up a help menu that will provide 
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
                    <li>Restart VSCode</li>
                    <li>Code!</li>
                </ol> 
            </div>
            </div>
            `,);
        
        VSCodeGlobals.globalState.update(IS_GREETED, true);
    }
}