import * as vscode from 'vscode';
import { activateTheme, ACTIVE_THEME, uninstallImages } from "./ThemeManager";
import { DokiTheme } from "./DokiTheme";
import DokiThemeDefinitions from './DokiThemeDefinitions';
import { StatusBarComponent } from './StatusBar';
import { VSCodeGlobals } from './VSCodeGlobals';
import { attemptToNotifyUpdates } from './NotificationService';
import { showChanglog } from './ChangelogService';

export interface DokiThemeDefinition {
	sticker: string;
	information: any;
}

export interface VSCodeDokiThemeDefinition {
	extensionName: string;
	themeDefinition: DokiThemeDefinition;
}


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'extension.remove.sticker',
			() => uninstallImages(context)
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'extension.doki.changelog',
			() => showChanglog(context)
		)
	);

	VSCodeGlobals.globalState = context.globalState;

	StatusBarComponent.initialize();
	context.subscriptions.push(StatusBarComponent);

	attemptToNotifyUpdates(context);

	DokiThemeDefinitions
		.map((dokiThemeDefinition: VSCodeDokiThemeDefinition) =>
			vscode.commands.registerCommand(
				dokiThemeDefinition.extensionName,
				() => activateTheme(
					new DokiTheme(dokiThemeDefinition.themeDefinition),
					context
				))
		).forEach(disposableHero =>
			context.subscriptions.push(disposableHero)
		);
}


export function deactivate() { }
