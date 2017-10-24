import React from 'react'

class Index extends React.Component { 
    constructor() { 
        super()
        this.state = {
            name:''
        }
    }
    render() { 
        return (
            <h1 onClick={this.change.bind(this)}>hello world {this.state.name}</h1>
        )
    }

    componentDidMount() {
        setTimeout(() => { 
            this.setState({
                name:"hello"
            })
        },3000)
    }

    change() { 
        this.setState({
            name:'react-ssr'
        })
    }
}

export default Index