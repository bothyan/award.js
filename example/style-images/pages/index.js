import React from 'react'
import IndexComponent from '../components/index'
import '../style/index.scss'
import '../style/tmp.scss'

import { Link } from 'swrn/router'

export default class Index extends React.Component { 
    render() { 
        return (
            <div>
                <h1 className="name">
                    hello world 
                    <span>你好，世界</span>
                </h1>
                <IndexComponent /> 
                <Link tag="span" className="click" to="/about">点击查看</Link>
            </div>    
        )
    }
}