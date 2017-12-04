# Swrn &middot; [![NPM version](https://img.shields.io/npm/v/swrn.svg)](https://www.npmjs.com/package/swrn) 

## 写在前面

`仅需一个命令，即可搭建一个基于react的服务端渲染的网站`

利用nodejs、react、webpack、express实现了一个服务端渲染的框架
    
nodejs作为服务器，express作为路由入口，webpack将同一份react项目代码编译打包，实现了对服务端和客户端的展现

- [快速体验](#快速体验)
  - [自定义路由](#自定义路由)
  - [异步加载初始化数据](#异步加载初始化数据)
  - [mock数据](#mock数据)
  - [样式资源](#样式)
  - [图片资源](#图片资源)
  - [react-css-modules](#react-css-modules)
- [基础命令](#基础命令)
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
    "dev": "swrn",
    "build": "swrn build",
    "start": "swrn start"
  }
}
```
在项目中创建文件`./pages/index.js`

```jsx
export default () => <div>Welcome to swrn.js!</div>
```

`开发环境` 部分服务端渲染，主要用来开发环境使用

执行 `npm run dev` 然后访问站点 `http://localhost:3000`

`发布环境` 全部服务端渲染，主要是发布环境使用

执行 `npm run build && npm run start` 然后访问站点 `http://localhost:3000`

另外在项目的`example`文件夹中，有相关功能的demo

## 基础命令

```shell
#执行开发环境命令
swrn 

#执行编译打包
swrn build

#开启正式环境命令
#这个启动之前 必须先执行`swrn build`
swrn start
```

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
                <Route path="/" render="/pages/index.js"/>
                <Route path="/about/:id" render="/pages/about.js"/>                 
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

## 样式

可以直接在项目通过`import`引用对应的`scss`文件,具体可以查看`example/with-style-sass`
```js
import React from 'react'
import '../style/index.scss'

export default class Index extends React.Component { 
    render() { 
        return (
            <div>
                <h1 className="name">
                    hello world 
                </h1>
            </div>    
        )
    }
}
```
## 图片资源
可以直接在项目通过`import`引用对应的图片文件,具体可以查看`example/style-images-fonts`
```js
import React from 'react'
import '../style/about.scss'
import { Link } from 'swrn/router'
import bg from '../images/2.jpg'

var bgs = require('../images/3.jpg')

export default class Index extends React.Component { 
    render() { 
        return (
            <div>
                <h1 className="name12345678">
                    hello about    
                </h1>
                <Link to="/"><img src={bg} /></Link>
                <img src={bgs} />
            </div>    
        )
    }
}
```

## react-css-modules
内置 `react-css-modules` 插件实现 css modules

该功能主要是项目发布的时候，即`swrn build`的时候，会进行处理

开发阶段，不采取css modules,不过写法都要按css modules来

全局的样式使用`className`,如果使用局部的样式,写成`styleName`;发布的时候会进行自动转换

具体可以查看`example/style-images-fonts`



## 总结的问题

    一份需要webpack打包的js文件，需要两份打包结果
    其中一个打包结果直接到目录dist/server下，另一个打包结果到目录dist/client下
    但注意的是，第二个打包结果中的所有js文件需要被一个方法包裹
    请写下实现此打包方式的webpack配置


# swrn的项目简要

## 基础架构
- [x] 前后端的路由统一处理方案，自定义前端路由
- [x] 组件数据初始化方案
- [x] mock数据，方便本地数据模拟开发
- [x] 客户端和服务端的热更新
- [x] 功能精简，仅仅一个swrn命令即可
- [x] css资源处理
- [x] 区分环境
- [x] 图片资源处理
- [ ] css modules
- [ ] 客户端跳转静态资源加载优化，即客户端路由优化
- [ ] 错误页面
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
