import * as vscode from 'vscode';
import { activateTheme, ACTIVE_THEME } from "./ThemeManager";
import { DokiTheme } from "./DokiTheme";
import DokiThemeDefinitions from './DokiThemeDefinitions';
import { StatusBarComponent } from './StatusBar';
import { VSCodeGlobals } from './VSCodeGlobals';

export interface DokiThemeDefinition {
	sticker: string;
	information: any;
}

export interface VSCodeDokiThemeDefinition {
	extensionName: string;
	themeDefinition: DokiThemeDefinition;
}


export function activate(context: vscode.ExtensionContext) {
	console.log('Activated Extension');

	VSCodeGlobals.globalState = context.globalState;

	StatusBarComponent.initialize();
	context.subscriptions.push(StatusBarComponent);

	DokiThemeDefinitions
		.map((dokiThemeDefinition: VSCodeDokiThemeDefinition) =>
			vscode.commands.registerCommand(
				dokiThemeDefinition.extensionName,
				() => activateTheme(new DokiTheme(dokiThemeDefinition.themeDefinition)))
		).forEach(disposableHero =>
			context.subscriptions.push(disposableHero)
		);
}


export function deactivate() { }
