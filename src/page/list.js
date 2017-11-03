import React from 'react'
import { Link } from 'react-router-dom'

class Index extends React.Component {

    static async getInitialProps() {
        return {
            name: 'topsss',
            hello:'123'
        }
    }

    render() {
        return (
            <h1>
                {this.props.name} {this.props.hello}
                <Link to="/">返回首页</Link>
            </h1>
        )
    }
}

export default Index