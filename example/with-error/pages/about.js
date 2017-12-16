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
            new:!this.state
        })
    }

    render() { 
        return (
            <div>
                <h1 className="hello" onClick={this.change.bind(this)} style={{ color: this.state.new ? 'red' : 'black' }}>
                    award.js detail {this.props.a.b}       
                </h1>
            </div>    
        )
    }
}