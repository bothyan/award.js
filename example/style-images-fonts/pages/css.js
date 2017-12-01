
import React from 'react'
import '../style/css.scss'

export default class Css extends React.Component { 
    render() { 
        return (
            <div id="wraper" styleName="age wraps">
                <h1 styleName="name">hello world</h1>       
                <div styleName="input">
                    <span styleName="book">
                        <b styleName="tips">321</b>
                    </span>
                    <a styleName="line">123</a>
                </div>
                <span styleName="line">abc</span>
            </div> 
        )    
    }
}