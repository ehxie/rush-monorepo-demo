# 使用工具规范项目的代码

1.ESLint

- 代码风格检查

  2.Prettier

- 代码格式化

  3.Husky

- 用于管理 git hook，进行代码提交前检查

  4.Lint-staged

- 只检查本次提交的代码，而不是全量

- 同时忽略我们不需要检查的文件

  5.Commitlint && Commitzen

- 对 commit message 进行格式检查和规范，使得项目中 commit message 统一

  - 有利于在后续利用 commit message 生成 CHANGELOG 和 release note

## 安装

1.eslint

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

2.prettier

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

3.需要进行一定的配置来保证 prettier 和 eslint 能够正确的协同工作

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
