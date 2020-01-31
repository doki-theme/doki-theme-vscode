// The module 'vscode' contains the VS Code extensibility API
// Importthe module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('The Doki-Doki Theme has be activated');

	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.Satsuki', () => {
		const otherthing = vscode.window.activeTextEditor;
		const snipper = new vscode.SnippetString("yeet");
		const workbench = vscode.extensions.getExtension('workbench.contributions.kind');

		console.log(Object.getPrototypeOf(vscode));
		otherthing?.insertSnippet(snipper);
		vscode.window.showInformationMessage('Satsuki Activated');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
