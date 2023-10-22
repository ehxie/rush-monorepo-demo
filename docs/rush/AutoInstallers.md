# AutoInstallers

## 介绍

通常仓库中都需要一些依赖来提供一些 shell 命令，例如 Prettier、ESLint 等。通常这些都会安装在 devDependencies 中。有时这些命令可能需要在 `rush install` 完成前使用，所以 Rush 使用了 AutoInstaller 提供一种隔离机制来安装这些依赖。

AutoInstaller 都是放在 `common/autoinstallers/` 目录中，每个 AutoInstaller 目录下都有一个 `packager.json` 文件和自己的 `shrinkwrap` 文件

AutoInstaller 不会被 `rush install` 安装，也不会包含任何 build 相关的逻辑提供给 `rush build`

AutoInstaller 就是一个纯净的 npm 包容器

AutoInstaller 通常和 Custom Commands 或者 Rush Plugins 一起使用

## 什么时候使用

1.使用 Rush Plugins 时必须使用 AutoInstaller

2.使用 Custom Commands 如果需要安装一些依赖，就可以使用 AutoInstaller

## 创建 AutoInstaller

1.创建 AutoInstaller

```bash
rush add-autoinstaller --name <name>
```

2.安装依赖

> 需要把根目录下的 `pnpm-workspace.yaml` 删除这里才会生成 `shrinkwrap` 文件

```bash
pnpm install <packageName>
```

3.安装完成后需要执行确保 shrinkwrap file 更新

```bash
rush update-autoinstaller --name <name>
```

删除 AutoInstaller

```bash
rm -rf common/autoinstallers/<name>
```

## 参考

[AutoInstallers](https://rushjs.io/pages/maintainer/autoinstallers)
