import React from 'react'
import PropTypes from 'prop-types'
import { ResolveRouter } from './router'

export default class App extends React.Component {

    getChildContext() {
        let props = Object.assign({},this.props) 
        delete props.Main
        return {
            SWRN_PROPS: {
                ...props
            }
        }
    }

    componentDidMount() {
        window.addEventListener('popstate', (e) => {
            const { page } = ResolveRouter(this.props.routes, location.pathname)
            const obj = document.createElement('script')

            obj.src = `/swrn/bundles${page}`

            document.body.appendChild(obj)
        })
    }

    render() {
        const { Main } = this.props
        return <Main />
    }
}

App.childContextTypes = {
    SWRN_PROPS: PropTypes.object
}