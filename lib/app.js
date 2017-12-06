import React from 'react'
import PropTypes from 'prop-types'
import { ResolveRouter } from './router'

export default class App extends React.Component {

    constructor() { 
        super()
        this.state = {
            routerComponents: {}
        }
    }

    getChildContext() {
        let props = Object.assign({},this.props) 
        delete props.Main
        return {
            AWARD_PROPS: {
                ...props,
                routerComponents:this.state.routerComponents
            }
        }
    }

    //设置popstate事件
    componentDidMount() {
        const { routeLoader } = this.props
        window.addEventListener('popstate', async (e) => {
            const { page:route } = ResolveRouter(this.props.data.routes, location.pathname)
            const Component = await routeLoader.loadPage(route)            
            routeLoader.notify({ Component, route })   
        })
    }

    render() {
        const { Main } = this.props
        return <Main />
    }
}

App.childContextTypes = {
    AWARD_PROPS: PropTypes.object
}