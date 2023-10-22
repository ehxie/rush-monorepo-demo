# 使用工具规范项目的代码

`ESLint`

- 代码风格检查

`Prettier`

- 代码格式化

`Husky`

- 用于管理 git hook，进行代码提交前检查

`Lint-staged`

- 只检查本次提交的代码，而不是全量

- 同时忽略我们不需要检查的文件

`Commitlint && Commitzen`

- 对 commit message 进行格式检查和规范，使得项目中 commit message 统一

- 有利于在后续利用 commit message 生成 CHANGELOG 和 release note

## 安装

### eslint

```bash
pnpm add -w -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

修改 package.json

```json
{
  "scripts": {
    "lint": "eslint ./ --ext .ts,.js,.json --max-warnings=0"
  }
}
```

在项目根目录下执行 `pnpm lint`

### prettier

```bash
pnpm add -w -D prettier
```

修改 package.json

```json
{
  "scripts": {
    "format": "prettier --config .prettierrc  '.' --write"
  }
}
```

### 解决 Prettier 和 ESlint 的冲突

需要进行一定的配置来保证 prettier 和 eslint 能够正确的协同工作

- ESLint 的代码风格规则会与 Prettier 冲突，所以需要应用 eslint-config-prettier 插件来关闭 ESLint 与 Prettier 的冲突，并且使用 eslint-plugin-prettier 插件来将 Prettier 规则集转换为 ESLint 规则集

```bash
pnpm add -w -D eslint-config-prettier eslint-plugin-prettier
```

修改 `.eslintrc`

- 如果不配置以下规则，在安装完 ESLint 和 Prettier 后执行 `pnpm lint` 是不会报错的

```json
{
  // ...
  "extends": [
    // ...
    // (即 prettier-config-prettier) 关闭所有可能干扰 Prettier 的规则，确保将其放在最后，这样才有机会覆盖其他配置
    "prettier"
  ],
  // 使得我们可以使用 typescript-eslint 中定义的规则集
  "plugins": [/** ... */ "prettier"],
  "rules": {
    // ...
    "prettier/prettier": "error", // 打开 prettier 插件提供的规则，该插件从 ESLint 内运行 Prettier
    // 下面两条规则与 Prettier 插件一起使用会出现问题：https://github.com/prettier/eslint-plugin-prettier/blob/master/README.md#arrow-body-style-and-prefer-arrow-callback-issue
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}
```

`linter-staged`

- 能够只检查 staged 的文件(即进行 git add 的文件)，而不是全量

```bash
pnpm add -w -D lint-staged
```

新增 `.lintstagedrc.js`

```js
const { ESLint } = require('eslint');

/**
 * 把要忽略的文件都过滤掉
 * @param {string[]} files
 * @returns
 */
const removeIgnoreFiles = async (files) => {
  const eslint = new ESLint();
  const ignoreFiles = await Promise.all(
    files.map((file) => eslint.isPathIgnored(file)),
  );
  const filterFiles = files.filter((_, index) => !ignoreFiles[index]);
  return filterFiles.join(' ');
};

module.exports = {
  // 这里的 files 是被 lint-staged 检测到的文件
  '*': async (files) => {
    const filesToLint = await removeIgnoreFiles(files);
    return [`eslint ${filesToLint} --max-warnings=0`];
  },
};
```

修改 `.husky/pre-commit`

```sh
- pnpm lint
+ npx lint-staged
```

### husky

[参考](/docs/rush/Husky.md)

### commitlint

commitlint 工具搭配 husky，实现在 commit 前对 git message 进行格式检查

```bash
pnpm add -w -D @commitlint/config-conventional @commitlint/cli
```

新增 `.commitlintrc.json`

- 要求 scope 不能为空

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "scope-empty": [2, "never"]
  }
}
```

新增 hook

```bash
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```

### commitizen

帮助我们生成规范的 git message

```bash
pnpm add -w -D commitizen cz-conventional-changelog
```

新增 `.czrc.json`

```json
{
  // 适配器，使用该适配器 commitzen 将已 Angular 的规范引导我们完成 git message 的创建
  "path": "cz-conventional-changelog"
}
```

修改 `package.json`

```json
{
  // ...
  "scripts": {
    // ...
    "cz": "cz"
  }
}
```

提交代码时使用 `pnpm cz` 代替 `git commit`

### VSCode 插件

ESLint: 开启后会在语法错误时在编辑器中显示错误

Prettier: 格式化代码

修改 `settings.json`

- 使用 Prettier 在保存时自动修复格式问题

```json
{
  "editor.formatOnSave": true
}
```

如果想用 ESLint 进行格式化

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true,
    "source.fixAll.eslint": true
  },
  // 关闭自带的格式化功能
  "editor.formatOnSave": false
}
```

> 要使项目成员都使用同一份 `settings.json` 配置，可以在 `.vscode` 目录下新建一个 `settings.json`，这样所有项目成员都会使用该配置
