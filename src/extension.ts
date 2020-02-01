import * as vscode from 'vscode';
import {activateTheme} from "./ThemeManager";
import {DokiTheme, Sticker} from "./DokiTheme";
import { ryukoBase64 } from './RyukoHolder';
import { satsukiSticker } from './StickerHolder';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.Satsuki', () => {
	  const satsuki = new DokiTheme("Satsuki", {
		  url: satsukiSticker
	  });
	  activateTheme(satsuki);
	});

	context.subscriptions.push(disposable);

	const ryukoCommand = vscode.commands.registerCommand('extension.Ryuko', () => {
		const ryuko = new DokiTheme("Ryuko", {
			url: ryukoBase64
		});
		activateTheme(ryuko);
	  });

	  context.subscriptions.push(ryukoCommand);
}

export function deactivate() {}
