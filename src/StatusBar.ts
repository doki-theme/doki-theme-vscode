import * as vscode from 'vscode';
import { CONFIG_STATUS_BAR_NAME, getConfig } from './ConfigWatcher';
import {getCurrentThemeAndSticker} from './ThemeManager';


class StatusBar implements vscode.Disposable {
    private _statusBarItem: vscode.StatusBarItem;

    constructor() {
        this._statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            Number.MIN_SAFE_INTEGER // furthest right on the right
        );

        this._statusBarItem.show();
    }

    initialize() {
        const {theme} = getCurrentThemeAndSticker();
        const customName = getConfig().get(CONFIG_STATUS_BAR_NAME) as string | undefined;
        const displayName = customName || theme.displayName;
        this.setText(displayName);
    }

    dispose() {
        this._statusBarItem.dispose();
    }

    public setText(text: string) {
        this._statusBarItem.text = `${text} $(heart)`;
    }
}

export const StatusBarComponent = new StatusBar();
