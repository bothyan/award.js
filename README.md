# react ssr 解决方案

## 技术栈：
react + react-dom + redux + redux-saga + webpack + express + nodejs8++

## 快速体验
```shell
git clone https://github.com/Topthinking/react-ssr.git
npm install
npm run dist
npm run server 
http://localhost:4000/ 
```

## 基础架构
- [x] 加入redux-saga作为redux异步处理的中间件
- [x] 服务端渲染获取数据的方法getInitialProps
- [x] getInitialProps赋予store的属性和方法，操作redux-saga获取数据
- [x] 加入react-router来控制前后端的路由,这里采用的redux-saga的异步方案来配合实现组件初始化数据的获取，后续研究异步方案
- [ ] 热更新，包括环境处理
- [ ] 离线包发布
- [ ] 静态文件处理，如css、图片资源

## 站点内容
- [x] 实现一个简单的todo list

## 说明

>  本项目主要研究react-ssr

>  如果觉得不错的话，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍