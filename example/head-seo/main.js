import React from 'react'

import { Router,Route } from 'award/router'

export default class Main extends React.Component{ 

    //公共数据，如果后面写了，会覆盖
    static async getInitialProps() {
        return {
            header: {
                title: '默认标题',
                meta: [{
                    charSet:'utf-8'
                }, {
                    name: 'viewport',
                    content:'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'    
                }]
            }
        }
    }

    render() { 
        return (
            <Router>123
                <h1>自定义路由</h1>    
                <Route path="/" render="/pages/index.js"/>
                <Route path="/:id/about/:uid" render="/pages/about.js"/>                  
            </Router>
        )
    }
}