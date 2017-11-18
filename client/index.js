import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Link, Router, Route } from 'swrn/router'
import webpackHotMiddlewareClient from 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_swrn/webpack-hmr'

//获取服务器数据
const AppDOM = document.getElementById('wrap')
const Obj = document.getElementById('data')
const DataState = JSON.parse(Obj.getAttribute("data-state"))
Obj.remove()

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

window.route = route

const __SWRN_PAGE__ = []
let Main = null

window.__SWRN_REGISTER_PAGE__ = function (route, fn) {
    if (route == '/main.js') {
        Main = fn()
    } else { 
        let Component = fn()
        window.route.subscribe((Component) => { 
            render(Main, {Component,route,...DataState})
        })
        render(Main, {Component,route,...DataState})
    }
}

function render(Component, props = {}) {
    if (!!Component) {
        ReactDOM.render(
            <AppContainer>
                <Component {...props} />
            </AppContainer>
            , AppDOM)
    } else { 
        Component = props.Component
        delete props.Component
        ReactDOM.render(
            <AppContainer>
                <Component {...props} />
            </AppContainer>
        , AppDOM)
    }    
}


