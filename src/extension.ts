// The module 'vscode' contains the VS Code extensibility API
// Importthe module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {activateTheme} from "./ThemeManager";
import {DokiTheme, Sticker} from "./DokiTheme";

export function activate(context: vscode.ExtensionContext) {
	console.log('The Doki-Doki Theme has be activated');

	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.Satsuki', () => {
	  const satsuki = new DokiTheme("Satsuki", new Sticker());
	  activateTheme(satsuki);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
