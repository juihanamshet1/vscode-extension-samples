// @ts-check
/// <reference path="C:\\dev\\microsoft\\vscode\\src\\vscode-dts\\vscode.proposed.inlineCompletionsAdditions.d.ts" />
/// <reference path="C:\\dev\\microsoft\\vscode\\src\\vscode-dts\\vscode.d.ts" />
const vscode = require('vscode');
const { window, Range } = vscode;
/**
 * @type {(e: vscode.ExtensionContext) => void}
*/
exports.activate = function (context) {
    console.log('hello world');
    vscode.commands.registerCommand('demo-ext.command1', async (...args) => {
        vscode.window.showInformationMessage('command1: ' + JSON.stringify(args));
    });
    /**
     * @type vscode.InlineCompletionItemProvider
    */
    const provider = {
        provideInlineCompletionItems: async (document, position, context, token) => {
            console.log('provideInlineCompletionItems triggered');
            const regexp = /\/\/ \[(.+?),(.+?)\)(.*?)\:(.*)/;
            if (position.line <= 0) {
                return;
            }
            const lineBefore = document.lineAt(position.line - 1).text;
            const matches = lineBefore.match(regexp);
            if (matches) {
                const start = matches[1];
                const startInt = parseInt(start, 10);
                const end = matches[2];
                const endInt = end === '*' ? document.lineAt(position.line).text.length : parseInt(end, 10);
                const flags = matches[3];
                const completeBracketPairs = flags.includes('b');
                const isSnippet = flags.includes('s');
                const text = matches[4].replace(/\\n/g, '\n');
                return {
                    items: [{
                        insertText: isSnippet ? new vscode.SnippetString(text) : text,
                        range: new Range(position.line, startInt, position.line, endInt),
                        completeBracketPairs
                    }],
                    commands: [
                        { command: 'demo-ext.command1', title: 'Hello World', arguments: [1, 2] }
                    ]
                };
            }
        }
    };
    vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);
}