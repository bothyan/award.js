
import React from 'react'


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
            <h1 onClick={this.change.bind(this)} style={{ color: this.state.new ? 'red' : 'black' }}>
                hello world eee
            </h1>
        )
    }
}