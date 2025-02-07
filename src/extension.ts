import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gitCheckoutMaster', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("请打开一个文件再执行 Git 回滚操作。");
            return;
        }

        const filePath = editor.document.fileName;

        // 检测 Git 默认分支（main/master）
        exec('git symbolic-ref refs/remotes/origin/HEAD', (err, stdout) => {
            let defaultBranch = 'master'; // 默认使用 master
            if (!err && stdout.includes('refs/remotes/origin/main')) {
                defaultBranch = 'main';
            } else {
                exec('git branch -a', (branchErr, branchStdout) => {
                    if (!branchErr) {
                        if (branchStdout.includes('main')) {
                            defaultBranch = 'main';
                        }
                    }
                });
            }

            // 执行 `git checkout <branch> -- <file>`
            const checkoutCmd = `git checkout ${defaultBranch} -- "${filePath}"`;
            exec(checkoutCmd, (checkoutErr, checkoutStdout, checkoutStderr) => {
                if (checkoutErr) {
                    vscode.window.showErrorMessage(`Git 回滚失败: ${checkoutStderr}`);
                } else {
                    vscode.window.showInformationMessage(`成功回滚 ${filePath} 到 ${defaultBranch} 版本`);
                }
            });
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
