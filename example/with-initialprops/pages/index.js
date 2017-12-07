
import React from 'react'
import { Link } from 'award/router'
import axios from 'axios'
import '../style/index.scss'

export default class Index extends React.Component { 

    static async getInitialProps(context) {

        console.log(context.query)
        
        const { data: { list } } = await axios.get('http://localhost:4000/api/list')

        return {
            name: 'top',
            list,
            header: {
                title:'123'
            }
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
            <h1 styleName="hello" onClick={this.change.bind(this)}>
                hello {this.props.name}      
            </h1>
                <Link to="/mine/12/home/140?code=123" tag="span">mine</Link>
                <ul>{this.props.list.map(item => { 
                    return <li key={item.id}>{item.name}</li>
                })}</ul>    
            </div>    
        )
    }
}