import React from 'react'
import Loading from './components/loading'
import { Router, Route, ResolveRouter } from 'award/router'

//路由改变的生命周期
export default class Main extends React.Component{ 

    //刷新页面加载前
    static async before({ req, res, routes }) {
        const { hostname, headers, url } = req
        const { name = false } = ResolveRouter(routes,url)
        if (!name) { 
            res.redirect(`http://m.ximalaya.com`)
        }
    }

    //无刷新页面加载前 路由对应的js文件加载前
    before({ url, query, name }) {
        if (!name) { 
            window.location.href =  `http://m.ximalaya.com`
        }
        this.obj = document.createElement('div')
        this.obj.innerHTML = '<h1>页面加载中...</h1>'
        document.body.appendChild(this.obj)
        return true
    }

    //js文件加载完毕
    after({ Component }) {         
        return true
    }

    //js文件中的组件内容执行完毕
    finish() { 
        this.obj.remove()
    }

    render() {
        return (
            <Router
                before={this.before.bind(this)}
                loading={Loading}
                after={this.after.bind(this)}
                finish={this.finish.bind(this)}
            >  
                <Route path="/" page="/pages/index.js" name="index"/>
                <Route path="/about/:id/home/:uid" page="/pages/about.js" name="about"/>                  
            </Router>
        )
    }
}