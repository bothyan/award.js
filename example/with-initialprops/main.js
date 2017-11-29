import React from 'react'

import { Router,Route } from 'swrn/router'


export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>   
                <Route path="/" render="/pages/index.js"/>
                <Route path="/mine/:id/home/:uid" render="/pages/home/mine/index.js"/>
                <h1>hello world</h1>  
                <p>这是一个统一的页面</p>
            </Router>
        )
    }
}