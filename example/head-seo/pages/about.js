
import React from 'react'
import { Link } from 'award/router'
//import '../style/about.scss'

export default class Mine extends React.Component { 

    static async getInitialProps() {
        return {
            name: 'top'
        }
    }

    change() { 
        console.log(1)
    }

    render() { 
        return (
            <h1 className="hello" onClick={this.change.bind(this)}>
                id:{this.props.query.id} uid:{this.props.query.uid}
                <br />
                <Link to="/" tag="a">回到首页</Link>
            </h1>
        )
    }
}