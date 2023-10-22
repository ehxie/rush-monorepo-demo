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

## lint-staged

> 支持多个 lint-staged 配置需要版本大于 12.3.4（[PR 1077](https://github.com/lint-staged/lint-staged/pull/1077)）

初始化

```base
rush init-autoinstaller --name rush-lint-staged
cd common/autoinstallers/rush-lint-staged
pnpm install lint-staged eslint     # 确保 lint-staged >= 12.3.4
rush update-autoinstaller --name rush-lint-staged
```

需要有一个全局的兜底文件：`<repo_root>/.lintstagedrc.js`

```js
module.exports = {
  '*': 'echo linting...'
};

```

- 各个项目下需要自行配置

e.g.: `example-app`
需要有一个 `.eslintrc` 和 一个 `.lintstagedrc.js` 文件

`.lintstagedrc.js`

```js
module.exports = {
  '*': 'eslint ./ --max-warnings=0'
};
```

`.eslintrc`

```json
{
  // 告诉 ESLint 这个文件是根级别文件，且 ESLint 不应该在该目录之外搜索配置文件
  "root": true,
  // ESLint 默认使用 Espree 解析器，该解析器只能解析 JS，而我们项目使用 TS，所以要用 TS 的解析器
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    // 使用了 TS 推荐的规则，且禁用了 eslint:recommended 中与之冲突的规则
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    // (即 prettier-config-prettier) 关闭所有可能干扰 Prettier 的规则，确保将其放在最后，这样才有机会覆盖其他配置
    "prettier"
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2021
  },
  // 使得我们可以使用 typescript-eslint 中定义的规则集
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error", // 打开 prettier 插件提供的规则，该插件从 ESLint 内运行 Prettier
    // 下面两条规则与 Prettier 插件一起使用会出现问题：https://github.com/prettier/eslint-plugin-prettier/blob/master/README.md#arrow-body-style-and-prefer-arrow-callback-issue
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}

```

需要安装依赖

```json
{

  "devDependencies": {
    "@typescript-eslint/parser": "~6.8.0",
    "typescript": "~5.2.2",
    "@typescript-eslint/eslint-plugin": "~6.8.0",
    "eslint-config-prettier": "~9.0.0",
    "eslint-plugin-prettier": "~5.0.1",
    "prettier": "~3.0.3"
  }
}
```

修改 `common/config/rush/command-line.json`

```json
{
    "commands": [
        {
            "name": "lint-staged",
            "commandKind": "global",
            "summary": "Run lint-staged",
            "shellCommand": "lint-staged",
            "autoinstallerName": "rush-lint-staged",
            "safeForSimultaneousRushProcesses": true
        }
    ]
}
```

添加到 git-hook 中

在 `common/git-hooks/pre-commit` 文件中添加

```sh
#!/bin/sh
rush lint-staged || exit $?
```

[参考](https://zhuanlan.zhihu.com/p/589856180)
