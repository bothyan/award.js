import React from 'react'
import { Link } from 'award/router'

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
                    Hello award.js           
                </h1>
                <Link to="/about" tag="span">查看详情</Link>
            </div>    
        )
    }
}