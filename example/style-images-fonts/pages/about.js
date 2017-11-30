import React from 'react'
import '../style/about.scss'
import { Link } from 'swrn/router'
import bg from '../images/2.jpg'

var bgs = require('../images/3.jpg')

export default class Index extends React.Component { 
    render() { 
        return (
            <div>
                <h1 className="name12345678">
                    hello about    
                </h1>
                <Link to="/"><img src={bg} /></Link>
                {bgs ? <img src={bgs} /> : null}
                {bgs}
            </div>    
        )
    }
}