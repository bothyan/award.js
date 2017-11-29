import React from 'react'

import { Router,Route } from 'swrn/router'


export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>
                <h1>自定义路由</h1>    
                <Route path="/" render="/pages/home/index.js"/>
                <Route path="/detail/:id" render="/pages/home/detail.js"/>                  
            </Router>
        )
    }
}