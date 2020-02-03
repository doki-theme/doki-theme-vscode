import * as vscode from 'vscode';
import { VSCodeGlobals } from './VSCodeGlobals';
import { ACTIVE_THEME } from './ThemeManager';


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
        const savedTheme: string | undefined = VSCodeGlobals.globalState.get(ACTIVE_THEME);
        if (savedTheme) {
            this.setText(savedTheme);
        }
    }

    dispose() {
        this._statusBarItem.dispose();
    }

    public setText(text: string) {
        this._statusBarItem.text = `${text} $(heart)`;
    }
}

export const StatusBarComponent = new StatusBar();