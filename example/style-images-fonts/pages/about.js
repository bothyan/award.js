import React from 'react'
import '../style/about.scss'
import { Link } from 'award/router'
import bg from '../images/2.jpg'

var bgs = require('../images/3.jpg')

/*
 const data = {
     bgs:require('../images/1.jpg'),bgm:require('../images/3.jpg')
 }
*/

export default class Index extends React.Component { 
    render() { 
        return (
            <div>
                <h1 styleName="name12345678">
                    hello about    
                </h1>
                <Link to="/"><img src={bg} /></Link>
                <img src={bgs} />
                <img src={require('../images/2.jpg')}/>
            </div>    
        )
    }
}