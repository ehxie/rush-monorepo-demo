# 如何使用 rush

## 初始化一个仓库

> 注意 Node 版本

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

rush 不支持安装全局依赖（不希望有幽灵依赖），所以安装依赖都需要进入到具体的项目目录下进行安装

```bash
rush add -p <moduleName>
```

Cli 的那种依赖可以使用 [AutoInstallers](/docs/rush/AutoInstallers.md)

使用 `rush update` 更新依赖

## 构建

- 在 `rush.json` 中的 `projects` 中声明的项目，只要在 `package.json` 中的 `scripts` 中声明了 `build` 命令，那么就可以在 `rush build` 的时候构建

```bash
rush build
```
