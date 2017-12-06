import React from 'react'

import { Router,Route } from 'award/router'


export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>
                <h1>自定义路由</h1>    
                <Route path="/" render="/pages/index.js"/>
                <Route path="/about/:id/home/:uid" render="/pages/about.js"/>                  
            </Router>
        )
    }
}