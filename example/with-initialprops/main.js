import React from 'react'

import { Router,Route } from 'award/router'

export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>   
                <Route path="/" page="/pages/index.js" /> 
                <Route path="/mine/:id/home/:uid" page="/pages/home/mine/index.js"/>
            </Router>
        )
    }
}