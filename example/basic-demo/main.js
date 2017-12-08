import React from 'react'

import { Router,Route } from 'award/router'


export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>
                <h1>自定义路由</h1>    
                <Route path="/" page="/pages/home/index.js" name="index"/>
                <Route path="/detail/:id" page="/pages/home/detail.js" name="detail"/>                  
            </Router>
        )
    }
}