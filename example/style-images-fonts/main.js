import React from 'react'
import { Router,Route } from 'award/router'

//import './style/font.scss'
//import bg from './images/1.jpg'

export default class Main extends React.Component{ 

    render() { 
        return (
            <Router>
                <Route path="/" page="/pages/index.js"/>
                <Route path="/about" page="/pages/about.js" />
                <Route path="/css" page="/pages/css.js" />                
            </Router>
        )
    }
}