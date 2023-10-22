# Lint

使用自定义命令来实现 Cli 的 Lint 功能

这里是基于之前 pnpm monorepo 进行的改造，一些配置文件就不赘述了，详情可以[参考](/docs/pnpm/Lint.md)

## prettier

使用 Custom Command 实现 Prettier 格式化代码

需要搭配 AutoInstaller 使用

1. 安装 AutoInstaller

```bash
rush add-autoinstaller --name prettier

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

[参考](https://zhuanlan.zhihu.com/p/589856180)
