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
            const { page:route,query } = ResolveRouter(this.props.data.routes)
            const Component = await routeLoader.loadPage(route)            
            routeLoader.notify({ Component, route, query })   
        })
    }

    render() {
        const { Main } = this.props
        return this.props.Component ? <Main /> : <Main {...this.props.data}/>        
    }
}

App.childContextTypes = {
    AWARD_PROPS: PropTypes.object
}