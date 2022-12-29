# 介绍

该插件主要功能是在构建的过程中提取引入的 Icon 组件，按需从远程下载图标，保存到本地，并将引入路径替换为下载的 Icon 组件路径

# 配置

- libraryName Icon 组件路径（不需要真实存在，为了后续替换）
- cacheDir 缓存的组件存放位置
- iconServer 请求 Icon 的服务器地址

```JSON
{
  "plugins": [
    [
      "babel-plugin-yxbj-icon",
      {
        "libraryName": "@yxbj-icons",
        "cacheDir": "./src/images/__generated__",
        "cacheExpired": 60000,
        "iconServer": "http://localhost:3001/component"
      }
    ]
  ]
}
```

# 依赖

- sync-fetch 拉取 Icon 组件

# 示例

进入 demo 目录，运行

```
babel index.js // 查看终端输出结果
```
