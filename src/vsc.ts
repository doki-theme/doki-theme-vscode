import VSCODE_BASE from 'vscode';

let vscode: typeof VSCODE_BASE | undefined;

try {
    vscode = require('vscode');
} catch {
    // nothing todo
}

export { vscode };
