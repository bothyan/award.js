
import React from 'react'
import { Link } from 'swrn/router'
//import './style/index.scss'

export default class Index extends React.Component { 

    constructor() { 
        super()
        this.state = {
            new:false
        }
    }

    change() { 
        this.setState({
            new:!this.state.new
        })
    }

    render() { 
        return (
            <div>
            <h1 className="hello" onClick={this.change.bind(this)} style={{ color: this.state.new ? 'red' : 'black' }}>
                hello test 123                
            </h1>
            <Link to="/mine/12" tag="span"><a>mine</a></Link>    
            </div>    
        )
    }
}