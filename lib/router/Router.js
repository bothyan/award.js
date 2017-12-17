import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { popstate, changeHistory } from './utils'
import { isInServer, isHandleRouter, isEmptyObj } from '../utils'

export default class Router extends React.Component {

    constructor(props, context) {
        super(props, context)

        this.before = this.before.bind(this)
        this.loading = this.loading.bind(this)
        this.after = this.after.bind(this)

        this._overlayTarget = null
    }

    async before({ to, query, route, name, error }) {
        const { before } = this.props

        if (!!before && typeof before === 'function') {
            return await before({ url: to, query, name, error })
        }

        return true
    }

    async loading() {
        const { loading } = this.props
        if (!!loading && typeof loading === 'function') {
            this._overlayTarget = document.createElement('div')
            document.getElementsByTagName('body')[0].appendChild(this._overlayTarget)
            ReactDOM.unstable_renderSubtreeIntoContainer(
                this,
                React.createElement(loading),
                this._overlayTarget
            )
        }
    }

    async after({ Component, route, query, to, error, history = true, push = true, replace = false }) {

        const { after, finish } = this.props
        const { routeLoader } = this.context.AWARD_PROPS
        let change = true
        if (!!after && typeof after === 'function') {
            change = await after({ Component, query, url: to, error })
        }

        //组件渲染完毕执行的回调
        let callback = async () => {
            if (!!finish && typeof finish === 'function') {
                await finish()
            }

            if (history) {
                changeHistory({ push, replace, to })
            }

            //如果是自定义的加载动画需要去掉
            if (this._overlayTarget != null) {
                ReactDOM.unmountComponentAtNode(this._overlayTarget) && this._overlayTarget.remove()
            }
        }

        if (change) {
            routeLoader.notify({ Component, route, query, callback, error })
        }
    }

    getChildContext() {
        return {
            AWARD_PROPS: {
                ...this.context.AWARD_PROPS,
                Award_Loading: {
                    before: this.before,
                    loading: this.loading,
                    after: this.after
                }
            }
        }
    }

    //处理路由的回退前进
    componentDidMount() {
        window.addEventListener('popstate', async (e) => {
            popstate.call(this)
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

        if (!!children.length == false) {
            if (isEmptyObj(children) == false) {
                //非空对象
                children = [children]
            } else {
                children = []
            }
        }

        let _i = 0

        if (route == '/_award_error') {
            _Component.push(<Component key={_i} error={contextAward_Props.data.error} />)
            _i++
        } else {
            if (children.length) {
                children.map(item => {
                    if (typeof item.type === 'function') {
                        const { page } = item.props
                        if (page === route) {
                            AWARD_PROPS.query = query
                            _Component.push(<Component
                                key={_i}
                                {...item.props}
                                {...AWARD_PROPS} />
                            )
                            _i++
                        }
                    } else {
                        _Component.push(item)
                    }
                })
            }
        }
        return _Component
    }
}

Router.contextTypes = {
    AWARD_PROPS: PropTypes.object
}

Router.childContextTypes = {
    AWARD_PROPS: PropTypes.object
}