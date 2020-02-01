import * as vscode from 'vscode';
import {activateTheme} from "./ThemeManager";
import {DokiTheme, Sticker} from "./DokiTheme";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.Satsuki', () => {
	  const satsuki = new DokiTheme("Satsuki", new Sticker());
	  activateTheme(satsuki);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
