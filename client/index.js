import React from 'react'
import ReactDOM from 'react-dom'
import { Link, Router, Route } from 'swrn/router'
import App from '../lib/app'

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
let _loaded = false

window.__SWRN_REGISTER_PAGE__ = async (route, fn) => {
    if (route == '/main.js') {
        Main = fn()
    } else { 
        let Component = fn(), initialProps = {}
        
        if (_loaded) {
            initialProps = !Component.getInitialProps ? {} : await Component.getInitialProps()
        } 
        _loaded = true
        window.route.subscribe((Component) => { 
            render(Main, {Component,route,...DataState,...initialProps})
        })
        render(Main, {Component,route,...DataState,...initialProps})
    }
}

function render(Component, props = {}) {    
    if (!!Component) {
        props.Main = Component
        ReactDOM.render(
            <App {...props} />
            , AppDOM)
        
    } else { 
        Component = props.Component
        delete props.Component
        props.Main = Component
        ReactDOM.render(
            <App {...props} />
        , AppDOM)
    }    
}

export default async () => { 
    
}

