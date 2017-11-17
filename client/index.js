import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Link, Router, Route } from 'swrn/router'
import './webpack-hot-middleware-client'

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
            <Router> 
                <Route path="/about/:id" render="./page/index.js"/>  
                {React.createElement(Component)}
            </Router>
        </AppContainer>
    , AppDOM)
}


