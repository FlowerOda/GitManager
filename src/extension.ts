import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.gitCheckoutMaster', () => {
    // 获取当前活跃编辑器
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('没有找到活跃的编辑器。');
      return;
    }

    // // 仅限 Python 文件（也可根据需要扩展到其它语言）
    // if (editor.document.languageId !== 'python') {
    //   vscode.window.showErrorMessage('该命令仅适用于 Python 文件。');
    //   return;
    // }

    // 获取当前文件的绝对路径
    const filePath = editor.document.uri.fsPath;

    // 获取工作区目录，默认第一个工作区目录为项目根目录
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('没有找到工作区目录。');
      return;
    }
    const cwd = workspaceFolders[0].uri.fsPath;

    // 确认操作
    vscode.window.showWarningMessage(
      `将执行 'git checkout master -- "${filePath}"'，恢复当前文件为 master 分支上的版本，确定继续吗？`,
      "Yes", "No"
    ).then(selection => {
      if (selection === "Yes") {
        // 组装 git 命令
        const command = `git checkout master -- "${filePath}"`;
        exec(command, { cwd: cwd }, (error, stdout, stderr) => {
          if (error) {
            vscode.window.showErrorMessage(`恢复失败：${stderr}`);
          } else {
            vscode.window.showInformationMessage('文件已成功恢复为 master 分支上的版本！');
            // 可选：刷新当前文件
            vscode.commands.executeCommand('workbench.action.files.revert');
          }
        });
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
