import * as vscode from 'vscode';
import RandExp from 'randexp';

const supportedLanguages = [
	'javascript',
	'javascriptreact',
	'typescript',
	'typescriptreact',
	'coffeescript',
	'ruby',
	'groovy',
];

const regexRegex = /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/[gimusy]*/; // so:17843691

function provideHover(document: vscode.TextDocument, position: vscode.Position) {
	// Get content of line
	const range = document.getWordRangeAtPosition(position, regexRegex);
	const match = document.getText(range);
	// Exit if no regex selected
	if (match.includes('\n')) return;
	// Create preview regexes
	const previews: string[] = [];
	let i = 0;
	while (previews.length < 5 && i++ < 20) {
		const annotation = new RandExp(eval(match));
		annotation.max = 5;
		const preview = annotation.gen();
		if (!previews.includes(preview)) {
			previews.push(preview);
		}
	}
	// Return
	const previewText = previews.map(text => '\n- `` ' + text + ' ``').join('');
	const outputText = `**Sample matches:**\n${previewText}`;
	const result = new vscode.MarkdownString(outputText);
	return new vscode.Hover(result);
}

// Activate extension
for (const language of supportedLanguages) {
	vscode.languages.registerHoverProvider(language, { provideHover: provideHover });
}
