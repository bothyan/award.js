import React from 'react'
import { Router,Route } from 'swrn/router'

import './style/font.scss'

export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>
                <Route path="/" render="/pages/index.js"/>
                <Route path="/about" render="/pages/about.js" />
                <h1 className="footer">footer</h1>
            </Router>
        )
    }
}