import React from 'react'
import IndexComponent from '../components/index'
import '../style/index.scss'
import '../style/tmp.scss'

import { Link } from 'award/router'

export default class Index extends React.Component { 
    render() { 
        return (
            <div>
                <h1 styleName='name'>
                    hello world 
                    <span>你好，世界</span>
                </h1>
                <IndexComponent /> 
                <Link tag="span" styleName="click" to="/about">点击查看</Link>
            </div>    
        )
    }
}