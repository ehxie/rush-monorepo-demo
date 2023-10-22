# 使用 pnpm 管理 monorepo

## 安装依赖

1.安装公共依赖

需要有 `pnpm-workspace.yaml` 告诉 pnpm 使用 monorepo 管理这个项目

这样就可以使用 pnpm 来安装依赖

- 安装在根目录可以使用 -w 参数

```bash
# 例如安装 typescript
pnpm install -w -D typescript
```

2.安装项目依赖
只需要在项目目录下执行 `pnpm add <package>` 即可

如果这里是依赖是当前 monorepo 下的项目，请确保已经在 `pnpm-workspace.yaml` 中配置了
