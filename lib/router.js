import React from 'react'
import PropTypes from 'prop-types'
import { isInServer } from './utils'

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

    constructor(props,context) {
        super(props,context)
        
        let query = {}

        if (isInServer()) {
            query = {}
        } else {
            query = ResolveRouter(context.SWRN_PROPS.routes, location.pathname).query
        }

        this.state = {
            query
        }
    }

    componentWillReceiveProps() {
        const { query } = ResolveRouter(this.context.SWRN_PROPS.routes, location.pathname)
        this.setState({
            query
        })
    }

    render() {
        //服务器上不需要对路由进行删除
        if (typeof SWRN_ROUTE != 'undefined' && SWRN_ROUTE) {
            return this.props.children
        }

        //客户端 需要对无关路由进行删除 服务器渲染
        let _Component = []
        let { Component, route, query } = this.context.SWRN_PROPS
        let { children } = this.props

        const SWRN_PROPS = Object.assign({},this.context.SWRN_PROPS)

        delete SWRN_PROPS.Component
        delete SWRN_PROPS.Main
        delete SWRN_PROPS.routes
        delete SWRN_PROPS.route

        children.map((item, index) => {
            if (typeof item.type === 'function') {
                const { render } = item.props
                if (render === route) {
                    SWRN_PROPS.query = isInServer() ? query : this.state.query
                    _Component.push(<Component
                        key={index}
                        {...item.props}
                        {...SWRN_PROPS}/>
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
    SWRN_PROPS: PropTypes.object
}

export class Route extends React.Component {
    render() {
        //服务器上获取路由配置信息
        if (typeof SWRN_ROUTE != 'undefined' && SWRN_ROUTE) {
            return <swrn swrn_route={JSON.stringify(this.props)} />
        }
        //客户端直接返回null,这里不做渲染，做功能
        return null
    }
}

export class Link extends React.Component {

    constructor(props) {
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    onClick() {

        let { routes } = this.context.SWRN_PROPS
        const { to } = this.props

        const { page } = ResolveRouter(routes, to)

        window.history.pushState({ url: location.href, as: to }, null, to)

        const obj = document.createElement('script')

        obj.src = `/swrn/bundles${page}`

        document.body.appendChild(obj)

    }

    render() {

        let { children, to, tag } = this.props

        if (typeof children === 'string') {

            tag = tag || 'a'

            return React.createElement(tag, {
                onClick: this.onClick
            }, children);
        }

        const props = {
            onClick: this.onClick
        }

        const child = React.Children.only(children)

        return React.cloneElement(child, props)
    }
}

Link.contextTypes = {
    SWRN_PROPS: PropTypes.object
}
