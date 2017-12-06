import React from 'react'
import PropTypes from 'prop-types'
import { isInServer, isHandleRouter } from './utils'

export function ResolveRouter(routes, pathname) {
    const resolve_router = {
        query: {},
        page: null
    }

    routes.map(item => {
        if (item.path) {
            let path = item.path.split("/")
            let queryId = [], dynamic = false
            path.map((v, i) => {
                if (v.substr(0, 1) === ':') {
                    path[i] = '(\\w+)'
                    queryId.push(v.substr(1))
                    dynamic = true
                }
            })

            if (dynamic) {

                path = new RegExp(path.join("\\/"))

                const match = pathname.match(path)

                if (match) {
                    for (let i = 1; i < match.length; i++) {
                        resolve_router.query[queryId[i - 1]] = match[i]
                    }
                    resolve_router.page = item.page
                }

            } else {

                if (item.path === pathname) {

                    resolve_router.page = item.page
                }
            }
        }
    })

    return resolve_router
}

export class Router extends React.Component {

    constructor(props, context) {
        super(props, context)

        let query = {}

        if (isInServer()) {
            query = {}
        } else {
            query = ResolveRouter(context.AWARD_PROPS.data.routes, location.pathname).query
        }

        this.state = {
            query
        }
    }

    componentWillReceiveProps() {
        const { query } = ResolveRouter(this.context.AWARD_PROPS.data.routes, location.pathname)
        this.setState({
            query
        })
    }

    render() {
        //服务器处理路由信息
        if (isInServer() && isHandleRouter()) {
            return this.props.children
        }

        //客户端 需要对无关路由进行删除 服务器渲染
        let _Component = [], AWARD_PROPS, route, query, Component
        const contextAward_Props = this.context.AWARD_PROPS

        if (isInServer()) {                        
            
            Component = contextAward_Props.Component
            route = contextAward_Props.route
            query = contextAward_Props.query
            AWARD_PROPS = Object.assign({}, contextAward_Props)

        } else {
            
            Component = contextAward_Props.Component
            route = contextAward_Props.data.route
            query = contextAward_Props.data.query
            AWARD_PROPS = Object.assign({}, contextAward_Props.data)            
        }
        
        let { children } = this.props

        delete AWARD_PROPS.routes
        delete AWARD_PROPS.route

        children.map((item, index) => {
            if (typeof item.type === 'function') {
                const { render } = item.props
                if (render === route) {
                    AWARD_PROPS.query = isInServer() ? query : this.state.query
                    _Component.push(<Component
                        key={index}
                        {...item.props}
                        {...AWARD_PROPS} />
                    )
                }
            } else {
                _Component.push(item)
            }
        })
        return _Component
    }
}

Router.contextTypes = {
    AWARD_PROPS: PropTypes.object
}

export class Route extends React.Component {
    render() {
        //处理路由配置，需要返回的消息
        if (isInServer() && isHandleRouter()) {
            return <award award_route={JSON.stringify(this.props)} />
        }
        //不处理直接返回
        return null
    }
}

export class Link extends React.Component {

    constructor(props) {
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    async onClick() {

        let { routes, assetPrefix } = this.context.AWARD_PROPS.data
        const { routeLoader } = this.context.AWARD_PROPS
        const { to } = this.props

        const { page:route } = ResolveRouter(routes, to)

        window.history.pushState({ url: location.href, as: to }, null, to)

        const Component = await routeLoader.loadPage(route)

        routeLoader.notify({ Component,route })        

    }

    render() {

        let { children, to, tag } = this.props

        if (typeof children === 'string' || children.type == 'img') {

            tag = tag || 'a'

            return React.createElement(tag, {
                ...this.props,
                onClick: this.onClick
            }, children);
        }

        const props = {
            ...this.props,
            onClick: this.onClick
        }

        const child = React.Children.only(children)

        return React.cloneElement(child, props)
    }
}

Link.contextTypes = {
    AWARD_PROPS: PropTypes.object
}
