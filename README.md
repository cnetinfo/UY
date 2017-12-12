# 项目名称：农家福/njf

> A Vue Project for Saas

## Build Setup

``` bash
# 安装node运行环境 install dependencies
npm install

# 启动项目 serve with hot reload at localhost:**** 端口号可 config/index.js dev.port配置
npm run dev

# 前端编译 打包生成的目录在dist下 build for production with minification
npm run build

# 打包并生成报告 build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


#目录结构描述
├── Readme.md                   // help
├── app                         // 应用
├── build                       // 打包配置
├── config                      // 配置
│   ├── dev.env.js             // 开发环境
│   ├── index.js                // 配置控制
│   ├── prod.env.js
├── dist                         // 编译生成文件
├── src                          // 开发目录主文件
│   ├── assets                   // 开发目录静态资源
│   ├── components               // 组件
│   ├── router                   // 路由
│   ├── store                    // 配置控制
│   ├── views                    // 视图文件
│   ├── App.vue                  // 主文件
│   └── main.js                  // 主页面控制器
├── static                        // web静态资源加载
├── .babelrc
├── .editorconfig
├── .gitignore
├── .postcssrc.js
├── index.html
├── node_modules
├── package.json

#V1.0.0 版本内容更新
1. U易商城前端架构转VUE
2. 修复手机过于流畅问题BUG
3. 新增团购新功能
4. 新增限时抢购新功能
5. 新增积分兑换新功能
6. 新增粮票兑换新功能等新功能
