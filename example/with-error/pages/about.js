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

    componentDidMount() { 
        console.log('')
    }

    render() { 
        return (
            <div>
                <h1 className="hello" onClick={this.change.bind(this)} style={{ color: this.state.new ? 'red' : 'black' }}>
                    award.js detaiasdasd  {this.props.a.b}
                    《怕《lasd 拉上打开 开凯
                </h1>
                <span>123asdasd</span>
            </div>    
        )
    }
}