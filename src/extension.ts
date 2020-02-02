import * as vscode from 'vscode';
import { activateTheme } from "./ThemeManager";
import { DokiTheme } from "./DokiTheme";
import DokiThemeDefinitions from './DokiThemeDefinitions';

export interface DokiThemeDefinition {
	sticker: string;
	information: any;
}

export interface VSCodeDokiThemeDefinition {
	extensionName: string;
	themeDefinition: DokiThemeDefinition;
}


export function activate(context: vscode.ExtensionContext) {
	const disposableHeros =
		DokiThemeDefinitions
			.map((dokiThemeDefinition: VSCodeDokiThemeDefinition) =>
				vscode.commands.registerCommand(
					dokiThemeDefinition.extensionName,
					() => activateTheme(new DokiTheme(dokiThemeDefinition.themeDefinition)))
			);

	disposableHeros.forEach(disposableHero =>
		context.subscriptions.push(disposableHero)
	);
}

export function deactivate() { }
