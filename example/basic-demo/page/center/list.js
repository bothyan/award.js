import React from 'react'

class Index extends React.Component {

    static async getInitialProps() {
        return {
            name:'center_top'
        }
    }

    render() {
        return (
            <h1>{this.props.name}</h1>
        )
    }
}

export default Index