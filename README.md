# react ssr 解决方案

## 写在前面
    利用react、webpack、express实现了一个服务端渲染的框架，
    其中express是一个桥梁作用，react和webpack都需要对服务端和客户端来处理，目前实现的功能在基础架构中可以看到
    node.js8 主要是为了在node端运行支持async和await用法

## 技术栈：
react + react-dom + react-router-dom + redux + redux-saga + webpack + express + nodejs8++

## 快速体验
```shell
git clone https://github.com/Topthinking/react-ssr.git
cd react-ssr
npm install

// 开发模式
npm run dev

// 发布模式
npm run build
npm run start 
http://localhost:4000/ 
```

## 基础架构
- [x] 加入redux-saga作为redux异步处理的中间件
- [x] 服务端渲染获取数据的方法getInitialProps
- [x] getInitialProps赋予store的属性和方法，操作redux-saga获取数据
- [x] react-router-dom作为前端路由,这里采用的redux-saga的异步方案来配合实现组件初始化数据的获取
- [x] mock数据，reducers合并和写法规则，saga的合并和写法规则
- [x] 客户端和服务端的热更新
- [ ] getInitialProps异步同步获取数据，也就是路由加载前异步获取初始化的数据
- [ ] 将架构代码按环境合并
- [ ] 将项目代码按结构拆分
- [ ] 静态文件处理，如css、图片资源
- [ ] 离线包发布

## 站点内容
- [x] 实现一个简单的todo list

## 说明

>  本项目主要研究react-ssr

>  如果觉得不错的话，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍

## 项目布局

```
├── client                   //存放客户端需要的入口文件
├── mock                     //存放mock数据的文件
├── server                   //存放服务端需要的入口文件
├── webpack                  //主要编译成服务端和客户端两个地方使用的代码
├── routes.js                //路由地址的配置
├── src                      //项目存放目录，这里可以根据当前的demo去扩展新的项目
```

## License

[GPL](https://github.com/Topthinking/react-ssr/blob/master/License)
