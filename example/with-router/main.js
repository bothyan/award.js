import React from 'react'

import { Router,Route } from 'swrn/router'


export default class Main extends React.Component{ 

    render() { 
        return (
            <Router {...this.props}>   
                <Route path="/" render="/page/index.js" name="1"/>
                <Route path="/mine/:id" render="/page/home/mine/index.js" name="2"/>
                <h1>hello world</h1>  
                <p>这是一个统一的页面</p>
            </Router>
        )
    }
}