
import React from 'react'
import { Link } from 'swrn/router'
import axios from 'axios'

export default class Index extends React.Component { 

    static async getInitialProps() {
        
        const { data: { list } } = await axios.get('http://localhost:4000/api/list')

        return {
            name: 'top',
            list
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
                <Link to="/mine/12/home/140" tag="span"><a>mine</a></Link>
                <ul>{this.props.list.map(item => { 
                    return <li key={item.id}>{item.name}</li>
                })}</ul>    
            </div>    
        )
    }
}