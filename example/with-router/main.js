import React from 'react'
import Loading from './components/loading'
import { Router,Route } from 'award/router'

//路由改变的生命周期
export default class Main extends React.Component{ 

    //路由对应的js文件加载前
    before({ url, query }) { 
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
                <Route path="/" render="/pages/index.js"/>
                <Route path="/about/:id/home/:uid" render="/pages/about.js"/>                  
            </Router>
        )
    }
}