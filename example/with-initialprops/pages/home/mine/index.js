
import React from 'react'
import { Link } from 'award/router'

export default class Mine extends React.Component {
    
    static async getInitialProps({query}) {
        return {
            id:query.id,
            uid:query.uid
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
            <h1 className="hello" onClick={this.change.bind(this)} style={{ color: this.state.new ? 'red' : 'black' }}>
                id：{this.props.id} uid： {this.props.uid}
                <br />
                <Link to="/" tag="a">回到首页</Link>
            </h1>
        )
    }
}