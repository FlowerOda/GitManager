import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  // 注册命令
  let disposable = vscode.commands.registerCommand('extension.gitRollback', () => {
    // 获取当前活跃的编辑器
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('没有找到活跃的编辑器。');
      return;
    }
    // 检查是否为 Python 文件（也可根据文件后缀判断）
    // if (editor.document.languageId !== 'python') {
    //   vscode.window.showErrorMessage('该命令仅适用于 Python 文件。');
    //   return;
    // }
    // 获取工作区（假设项目根目录为 git 仓库所在目录）
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('没有找到工作区目录。');
      return;
    }
    // 这里假定第一个工作区目录为当前项目根目录
    const cwd = workspaceFolders[0].uri.fsPath;

    // 可选：确认是否执行回滚操作
    vscode.window.showWarningMessage(
      "将执行 'git reset --hard HEAD^' 回滚到上一个版本，确定继续吗？",
      "Yes", "No"
    ).then(selection => {
      if (selection === "Yes") {
        exec("git reset --hard HEAD^", { cwd: cwd }, (error, stdout, stderr) => {
          if (error) {
            vscode.window.showErrorMessage(`回滚失败：${stderr}`);
          } else {
            vscode.window.showInformationMessage('回滚成功！');
          }
        });
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
