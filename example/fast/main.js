import React from 'react'

import { Router,Route } from 'swrn/router'


export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>   
                <Route path="/" render="./page/index.js" />
                <Route path="/mine/:id" render="./page/home/mine/index.js"/>                
            </Router>
        )
    }
}