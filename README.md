# swrn

[![NPM version](https://img.shields.io/npm/v/swrn.svg)](https://www.npmjs.com/package/swrn) 

## 写在前面
    利用nodejs、react、webpack、express实现了一个服务端渲染的框架
    nodejs作为服务器，express作为路由入口，webpack将同一份react项目代码编译打包，实现了对服务端和客户端的展现

## 快速体验

安装
```bash
//node > 8
npm install --save swrn
```

package.json
```json
{
  "scripts": {
    "dev": "swrn"
  }
}
```
在项目中创建文件`./page/index.js`

```jsx
export default () => <div>Welcome to swrn.js!</div>
```

接下来执行 `npm run dev` 然后访问站点 `http://localhost:4000`

另外在项目的`example`文件夹中，有一些已经实现的小项目

## 自定义路由

需要在项目的根目录下定义名称为`main.js`的文件，内容如下
path  访问的地址
render 绝对地址，暂时是这样，后续优化
```js
import React from 'react'
import { Router,Route } from 'swrn/router'

export default class Main extends React.Component{ 
    render() { 
        return (
            <Router>
                <h1>hello Swrn.js</h1>    
                <Route path="/" render="/page/index.js"/>
                <Route path="/about/:id" render="/page/about.js"/>                 
            </Router>
        )
    }
}
```


## 总结的问题

    一份需要webpack打包的js文件，需要两份打包结果
    其中一个打包结果直接到目录dist/server下，另一个打包结果到目录dist/client下
    但注意的是，第二个打包结果中的所有js文件需要被一个方法包裹
    请写下实现此打包方式的webpack配置


# swrn的项目简要

## 技术难点

  1.保证react-routerV4前端路由的数据加载方式和服务端路由数据加载的方式一致性,都是统一使用getInitialProps方法，兼容了redux和ajax方式


## 基础架构
- [x] 加入redux-saga作为redux异步处理的中间件
- [x] 服务端渲染获取数据的方法getInitialProps
- [x] getInitialProps赋予store的属性和方法，操作redux-saga获取数据
- [x] react-router-dom作为前端路由,这里采用的redux-saga的异步方案来配合实现组件初始化数据的获取
- [x] mock数据，reducers合并和写法规则，saga的合并和写法规则
- [x] 客户端和服务端的热更新
- [x] getInitialProps异步同步获取数据，也就是路由加载前异步获取初始化的数据
- [ ] 将业务代码 和 系统架构代码分开  现在还剩下redux的代码 还耦合 接下来需要解决
- [ ] 将架构代码按环境合并
- [ ] 将项目代码按结构拆分
- [ ] 静态文件处理，如css、图片资源
- [ ] 离线包发布

## 说明

>  本项目主要研究react-ssr

>  如果觉得不错的话，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍


## 开发
```shell
git clone https://github.com/Topthinking/swrn.git
npm install
npm run build //启动源码编译服务
cd example/fast
../../dist/bin/swrn //开启服务，当看到访问的地址，即可访问
```
然后访问站点 `http://localhost:4000` 进行修改源码，编译，调试，开发

## License

[GPL](https://github.com/Topthinking/react-ssr/blob/master/License)