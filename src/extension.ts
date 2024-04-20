import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.workspace.onDidChangeTextDocument((e) => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === "markdown") {
      const document = e.document;

      editor.edit((editBuilder) => {
        for (let li = 0; li < document.lineCount; li++) {
          const line = document.lineAt(li);
          const text = line.text;

          let match;
          const spaceRegex = /  /g; // Regular expression to match two consecutive spaces

          // Iterate over matches of two consecutive spaces in the line
          while ((match = spaceRegex.exec(text)) !== null) {
            const start = match.index;
            const end = match.index + 2;
            const newText = "<br>";

            // Replace two consecutive spaces with <br>
            const range = new vscode.Range(li, start, li, end);
            editBuilder.replace(range, newText);
          }
        }
      });
    }
  });

  context.subscriptions.push(disposable);
}
