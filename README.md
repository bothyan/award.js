# Award &middot; [![NPM version](https://img.shields.io/npm/v/award.svg)](https://www.npmjs.com/package/award) 

## 写在前面

`仅需一个命令，即可搭建一个基于react的服务端渲染的网站`

`单页面应用的写法，服务端渲染的实现`

利用nodejs、react、webpack、express实现了一个服务端渲染的框架
    
nodejs作为服务器，express作为路由入口，webpack将同一份react项目代码编译打包，实现了对服务端和客户端的展现

- [快速体验](#快速体验)
- [功能说明](#功能说明)
  - [basic-shell](#basic-shell)
  - [award/router](#awardrouter)
  - [getInitialProps](#getinitialprops)
  - [mock](#mock)
  - [style](#style)
  - [images](#images)
  - [react-css-modules](#react-css-modules)
  - [header-seo](#header-seo)
- [基础架构](#基础架构)
  
  

## 快速体验

安装
```bash
//node > 8
npm install --save award
```

package.json
```json
{
  "scripts": {
    "dev": "award",
    "build": "award build",
    "start": "award start"
  }
}
```
在项目中创建文件`./pages/index.js`

```jsx
export default () => <div>Welcome to award.js!</div>
```

`开发环境` 部分服务端渲染，主要用来开发环境使用

执行 `npm run dev` 然后访问站点 `http://localhost:3000`

`发布环境` 全部服务端渲染，主要是发布环境使用

执行 `npm run build && npm run start` 然后访问站点 `http://localhost:3000`

另外在项目的`example`文件夹中，有相关功能的demo


## 功能说明

### basic-shell

```shell
#执行开发环境命令
award 

#执行编译打包
award build

#开启正式环境命令
#这个启动之前 必须先执行`award build`
award start
```

### award/router

`import { Router,Route,Link } from 'award/router'`

默认路由是根据`pages`文件夹下的路径来自动划分的

如果需要自定义路由形式，那么需要在项目的根目录下创建名称为`main.js`的文件，内容如下

path  访问的地址

render 绝对地址，暂时是这样，后续优化

```jsx
import React from 'react'
import { Router,Route } from 'award/router'

export default class Main extends React.Component{ 
    render() { 
        return (
            <Router>
                <h1>hello award.js</h1>    
                <Route path="/" render="/pages/index.js"/>
                <Route path="/about/:id" render="/pages/about.js"/>                 
            </Router>
        )
    }
}
```

这样就可以实现路由的自定义配置

跳转 `Link`

具体使用方法可以参考`example/with-router`


### getInitialProps

在组件内部使用`getInitialProps`,同时在组件内部，可以通过`this.props`获取
```jsx
//context 内容包括
//页面刷新，在服务端可以获取到 req 和 res
//客户端页面无刷新跳转，可以获取到 query
//const {query} = context; query即 path中的:id之类的，同时还包括location.search
static async getInitialProps(context) {      
    const { data: { list } } = await axios.get('http://localhost:4000/api/list')
    return {
        name: 'top',
        list
    }
}
```

### mock

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

### style

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

### images
可以直接在项目通过`import`引用对应的图片文件,具体可以查看`example/style-images-fonts`
```js
import React from 'react'
import '../style/about.scss'
import { Link } from 'award/router'
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

### react-css-modules
内置 `react-css-modules` 插件实现 css modules

该功能主要是项目发布的时候，即`award build`的时候，会进行处理

开发阶段，不采取css modules,不过写法都要按css modules来

全局的样式使用`className`,如果使用局部的样式,写成`styleName`;发布的时候会进行自动转换

具体可以查看`example/style-images-fonts`

⚠️ 如果项目中没有 引用`scss`文件，那么不要写`styleName`,这样会在发布时候的访问报警告

全局样式，需要这样写
```scss
// 局部样式 就不需要加:global,采用styleName关键字生效
:global{
    /**
     * 这里写全局使用的css样式，这个时候class用className
     /
}
```

### header-seo
主要是设置每个页面的`title` `meta` 等标签用来进行seo优化

该功能具体的实现，可以在例子`example/head-seo`中看到

简单说明，即通过`getInitialProps`方法，返回对象中含有`header`字段，会进行解析

可以在`main.js`中设置全局通用的头，比如浏览器缩放等，也可以设置一些全局参数

如果在页面级组件内页设置了`getInitialProps`方法，如果返回的字段名称重复，会覆盖`main.js`中返回的

其实在代码中实现的一个对象的深拷贝动作，即类似`JQuery`的`$.extend`方法


---
---

# Award系统简要

## 总结的问题

    一份需要webpack打包的js文件，需要两份打包结果
    其中一个打包结果直接到目录dist/server下，另一个打包结果到目录dist/client下
    但注意的是，第二个打包结果中的所有js文件需要被一个方法包裹
    请写下实现此打包方式的webpack配置




## 基础架构
- [x] 前后端的路由统一处理方案，自定义前端路由
- [x] 组件数据初始化方案
- [x] mock数据，方便本地数据模拟开发
- [x] 客户端和服务端的热更新
- [x] 功能精简，仅仅一个award命令即可
- [x] css资源处理
- [x] 区分环境
- [x] 图片资源处理
- [x] css modules
- [x] 客户端跳转静态资源加载优化，即客户端路由优化
- [x] Head处理，即SEO优化处理
- [ ] 错误页面
- [ ] 动态配置文件，主要配置cdn等一些资源路径，还有webpack的扩展，但是目前所要用到的都已经内置了
- [ ] 离线包发布

## 说明

>  本项目主要研究react-ssr

>  如果觉得不错的话，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍


## 开发
```shell
git clone https://github.com/Topthinking/award.js.git
npm install
npm run build //启动源码编译服务
cd example/fast
../../dist/bin/award //开启服务，当看到访问的地址，即可访问
```
然后访问站点 `http://localhost:3000` 进行修改源码，编译，调试，开发

## License

[GPL](https://github.com/Topthinking/react-ssr/blob/master/License)
