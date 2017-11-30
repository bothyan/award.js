import React from 'react'
import { Router,Route } from 'swrn/router'

import './style/font.scss'
import bg from './images/1.jpg'

export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>
                <Route path="/" render="/pages/index.js"/>
                <Route path="/about" render="/pages/about.js" />
                <img src={bg} />
            </Router>
        )
    }
}