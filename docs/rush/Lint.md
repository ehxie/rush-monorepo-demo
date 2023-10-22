# Lint

使用自定义命令来实现 Cli 的 Lint 功能

这里是基于之前 pnpm monorepo 进行的改造，一些配置文件就不赘述了，详情可以[参考](/docs/pnpm/Lint.md)

## prettier

使用 Custom Command 实现 Prettier 格式化代码

需要搭配 AutoInstaller 使用

1. 安装 AutoInstaller

```bash
rush init-autoinstaller --name prettier

cd common/autoinstallers/prettier

pnpm install prettier
```

2.添加 Custom Command

修改 `common/config/rush/command-line.json` 文件

```bash
{
    "commands": [
        {
        "name": "format",
        "commandKind": "global",
        "summary": "Used by the pre-commit Git hook. This command invokes Prettier to reformat staged changes.",
        "safeForSimultaneousRushProcesses": true,
        "autoinstallerName": "rush-prettier",
        "shellCommand": "prettier --config .prettierrc  '.' --write"
        }
    ]
}
```

执行 `rush format` 进行代码格式化

## commitlint

安装

```bash
rush init-autoinstaller --name rush-commitlint

cd common/autoinstallers/rush-commitlint
pnpm install @commitlint/cli @commitlint/config-conventional
rush update-autoinstaller --name rush-commitlint
```

将 `.commitlintrc` 文件复制到 `common/autoinstallers/rush-commitlint/` 目录下，否则会找不到 extends 中的依赖

修改 `common/config/rush/command-line.json` 文件

```json
{
  "commands": [
    {
      "name": "commitlint",
      "commandKind": "global",
      "summary": "Used by the commit-msg Git hook. This command invokes commitlint to lint commit message.",
      "safeForSimultaneousRushProcesses": true,
      "autoinstallerName": "rush-commitlint",
      "shellCommand": "commitlint --config common/autoinstallers/rush-commitlint/.commitlintrc"
    }
  ],
  "parameters": [
    {
      "parameterKind": "string",
      "argumentName": "FILENAME",
      "longName": "--edit",
      "description": "read last commit message from the specified file or fallbacks to ./.git/COMMIT_EDITMSG",
      "associatedCommands": ["commitlint"]
    }
  ]
}

```

测试是否生效：`echo "aaa" | rush commitlint` 会发现报错了

添加到 git-hook 中

在 `common/git-hooks/commit-msg` 文件中添加

```sh
#!/bin/sh
# 在 "git commit" 执行时，该钩子会被调用，并且没有参数。如果该钩子想要阻止提交，那么它应该以返回非零状态推出。

# --edit '' 是为了让 commitlint 去从 ./.git/COMMIT_EDITMSG 文件中去读取，从而正确地检查当前的 commit message
rush commitlint --edit '' || exit $?
```

执行 `rush update` 安装 git-hook
> 如果之前装过 husky 需要执行 `git config --unset core.hooksPath` 删除配置

[参考](https://zhuanlan.zhihu.com/p/589856180)
