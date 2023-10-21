# Husky

通过 Husky 来管理 git hook

## 安装

安装 husky

```bash
pnpm add -w -D husky
# 安装完成执行
npx husky install
```

修改 `pacakge.json`

- 保证在安装依赖时会通过 husky 管理 git hook

```json
{
    "scripts": {
        "prepare": "husky install",
        // ...
    }
}
```

## 使用

需求：在提交代码时进行校验

```bash
npx husky add .husky/pre-commit "pnpm lint"
```
