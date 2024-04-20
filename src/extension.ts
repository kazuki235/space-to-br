import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let lastSpace = { row: -1, col: -1, isSpace: false };
  let disposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === "markdown") {
      const changes = event.contentChanges;

      if (changes.length > 0) {
        const change = changes[0];
        const newText = change.text;
        const row = change.range.start.line;
        const col = change.range.start.character;

        console.log(lastSpace);

        // Detect if the new input is a space
        if (
          newText === " " &&
          lastSpace.isSpace &&
          lastSpace.row === row &&
          lastSpace.col === col
        ) {
          // Replace two consecutive spaces with <br>
          const range = new vscode.Range(row, col - 1, row, col + 1);
          editor.edit((editBuilder) => {
            editBuilder.replace(range, "<br>");
          });
          lastSpace.isSpace = false; // Reset after replacement
        } else {
          lastSpace.isSpace = newText === " ";
          lastSpace.row = row;
          lastSpace.col = col + newText.length;
        }
      }
    }
  });

  context.subscriptions.push(disposable);
}
