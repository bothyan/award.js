# react ssr 实现方案

## 技术栈：
react + react-dom + redux + redux-saga + webpack + express + nodejs

## 效果查看命令
```shell
npm install
npm run dist
npm run server 
http://localhost:4000/ 
```

## 基础架构
- [x] 采用redux-saga实现todoList
- [x] 服务端渲染数据获取getInitialProps
- [x] getInitialProps赋予store的属性和方法，操作redux-saga获取数据
- [ ] 加入react-router来控制前后端的路由
- [ ] 热更新，包括环境处理
- [ ] 离线包发布
- [ ] 静态文件处理，如css、图片资源

## 站点内容
- [x] 实现一个简单的todo list

## 说明

>  本项目主要研究react-ssr

>  如果觉得不错的话，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍