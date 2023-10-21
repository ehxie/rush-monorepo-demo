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
