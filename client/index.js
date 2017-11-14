import 'react-hot-loader/patch'
import webpackHotMiddlewareClient from 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_client/webpack-hmr'
import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader';

//获取服务器数据
const AppDOM = document.getElementById('wrap')
// const Obj = document.getElementById('data')
// const DataState = JSON.parse(Obj.getAttribute("data-state"))
// Obj.remove()

// ReactDOM.render(
//     <App {...DataState}/>   
//     ,
//     AppDOM
// )

class Loading { 
    constructor() { 
        this.subscriptions = new Set()
    }

    subscribe(fn) { 
        this.subscriptions.add(fn)
        return () => this.subscriptions.delete(fn)
    }

    update(Component) { 
        this.notify(Component)
    }

    notify(data) { 
        this.subscriptions.forEach((fn) => fn(data))
    }
}

let route = new Loading()

route.subscribe((Component) => { 
    render(Component)
})

window.route = route

function render(Component) {
    ReactDOM.render(
        <AppContainer>
            {React.createElement(Component)}
        </AppContainer>
        , AppDOM)
}

