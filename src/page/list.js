import React from 'react'

class Index extends React.Component {

    static async getInitialProps() {
        return {
            name:'topsss'
        }
    }

    render() {
        return (
            <h1>{this.props.name}</h1>
        )
    }
}

export default Index