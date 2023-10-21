# 如何使用 rush

1.安装 rush

```bash
npm install -g @microsoft/rush
```

2.初始化 rush

```bash
# 创建一个空仓库
mkdir <project>
# 先进入仓库根目录
cd <project>
# 初始化 rush(不在空仓库执行会报错)
rush init
```

3.怎么把项目迁移进来

- 优先迁移「叶子」项目
  - 即在这个 monorepo 中没有依赖于其他项目的项目进来

假设有依赖关系：A -> B，B -> C

- 那么迁移顺序就是 C -> B -> A

迁移进来的项目需要把以下的文件删除掉, 否则会有影响，[参考](https://rushjs.io/pages/maintainer/add_to_repo/)

```bash
rm -f shrinkwrap.yaml npm-shrinkwrap.json package-lock.json yarn.lock
rm -f .npmrc          # (if it makes sense)
rm -f .gitattributes  # (if it makes sense)
rm -f .gitignore      # (if it makes sense)
```

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
