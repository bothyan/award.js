import React from 'react'
import { Link } from 'react-router-dom'

const getRemoteData = () => { 
    return new Promise((resolve, reject) => {
        setTimeout(() => { 
            resolve({
                name: 'top'
            })
        },1500)
    })
}

class Index extends React.Component {

    static async getInitialProps() {
        const data = await getRemoteData()
        return {...data}
    }

    render() {
        return (
            <div>
                <h1> hello {this.props.name}</h1>
                <Link to="/">返回首页</Link>
            </div>    
        )
    }
}

export default Index