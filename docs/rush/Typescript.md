# rush 中使用 TypeScript

1.在项目的根目录的 DevDependencies 中添加 typescript 和 ts-node 依赖。

```bash
# 使用 -w 前需要确保 pnpm 知道该仓库是 monorepo（需要有 `pnpm-workspace.yaml`）
pnpm add -w -D typescript ts-node @types/node
```
