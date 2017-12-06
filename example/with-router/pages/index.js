
import React from 'react'
import { Link } from 'award/router'

export default class Index extends React.Component { 

    static async getInitialProps() {
        return {
            name: 'top'
        }
    }

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
                hello {this.props.name}      
            </h1>
                <Link to="/about/12/home/14" tag="span">查看详情12</Link>                  
            </div>    
        )
    }
}