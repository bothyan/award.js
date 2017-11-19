# Swrn &middot; [![NPM version](https://img.shields.io/npm/v/swrn.svg)](https://www.npmjs.com/package/swrn) 

## 写在前面
    利用nodejs、react、webpack、express实现了一个服务端渲染的框架
    nodejs作为服务器，express作为路由入口，webpack将同一份react项目代码编译打包，实现了对服务端和客户端的展现

- [快速体验](#快速体验)
  - [自定义路由](#自定义路由)
  - [异步加载初始化数据](#异步加载初始化数据)
  - [mock数据](#mock数据)
- [基础架构](#基础架构)
  
  

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

另外在项目的`example`文件夹中，有相关功能的demo

## 自定义路由

如果需要扩展路由，那么在项目的根目录下定义名称为`main.js`的文件，内容如下

path  访问的地址

render 绝对地址，暂时是这样，后续优化
```jsx
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

## 异步加载初始化数据

在组件内部使用`getInitialProps`,同时在组件内部，可以通过`this.props`获取
```js
static async getInitialProps() {    
    const { data: { list } } = await axios.get('http://localhost:4000/api/list')
    return {
        name: 'top',
        list
    }
}
```

## mock数据

在项目根目录新建`mock`文件夹，在其文件夹中新建本地需要模拟数据的js文件
```js
module.exports = (server) => { 
    //函数内部可以写任意 多个mock数据
    server.get('/api/list', async (req, res) => {         
        res.send('返回内容，比如json')
    })

    //...
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
- [x] 前后端的路由统一处理方案，自定义前端路由
- [x] 组件数据初始化方案
- [x] mock数据，方便本地数据模拟开发
- [x] 客户端和服务端的热更新
- [x] 功能精简，仅仅一个swrn命令即可
- [ ] 区分环境
- [ ] 错误异常处理
- [ ] 静态文件处理，如css、图片资源
- [ ] 离线包发布

## 说明

>  本项目主要研究react-ssr

>  如果觉得不错的话，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍


## 开发
```shell
git clone https://github.com/Topthinking/swrn.js.git
npm install
npm run build //启动源码编译服务
cd example/fast
../../dist/bin/swrn //开启服务，当看到访问的地址，即可访问
```
然后访问站点 `http://localhost:4000` 进行修改源码，编译，调试，开发

## License

[GPL](https://github.com/Topthinking/react-ssr/blob/master/License)