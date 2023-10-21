# rush monorepo demo

使用 rush 和 monorepo 管理项目

## Versions

NodeJS: v18.17.1

## setup

```bash
npm install -g @microsoft/rush
```

## 文件说明

`pnpm-workspace.yaml`

- 会让 pnpm 要使用 monorepo 的模式管理这个项目，他的内容告诉 pnpm 哪些目录将被划分为独立的模块，这些所谓的独立模块被包管理器叫做 workspace(工作空间)

更多关于 monorepo 的使用：[参考](/docs/rush/READMD.md)
