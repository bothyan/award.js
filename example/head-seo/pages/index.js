
import React from 'react'
import { Link } from 'award/router'
import '../style/index.scss'

export default class Index extends React.Component { 

    static async getInitialProps() {
        return {
            name: 'top',
            header: {
                title: {
                    children: '首页'
                }
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
            <h1 styleName="hello">
                hello {this.props.name}      
            </h1>
                <Link to="/12/about/14" tag="span">查看详情</Link>                  
            </div>    
        )
    }
}