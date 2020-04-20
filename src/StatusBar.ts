import * as vscode from 'vscode';
import {getCurrentTheme} from './ThemeManager';


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
        const currentTheme = getCurrentTheme();
        this.setText(currentTheme.displayName);
    }

    dispose() {
        this._statusBarItem.dispose();
    }

    public setText(text: string) {
        this._statusBarItem.text = `${text} $(heart)`;
    }
}

export const StatusBarComponent = new StatusBar();
