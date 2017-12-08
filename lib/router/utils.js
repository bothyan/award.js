import url from 'url'

export function ResolveRouter(routes, to = '') {
    let pathname = to == '' ? location.href : to
    const urlParse = url.parse(pathname, true)

    let query = urlParse.query
    pathname = urlParse.pathname

    const resolve_router = {
        query,
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
                    Object.assign(resolve_router, item)
                }

            } else {

                if (item.path === pathname) {
                    Object.assign(resolve_router, item)
                }
            }
        }
    })

    return resolve_router
}

//这里面的this作用域要用call发生变化
//await LinkPage.call(this,e)
export async function LinkPage(e = null) {

    const { to, push = true, replace = false } = this.props

    //地址是http访问
    if (/http(s)?:\/\//.test(to)) {
        window.location.href = to
    } else {
        e != null && e.preventDefault()

        const { routeLoader, data: { routes, assetPrefix }, Award_Loading = null } = this.context.AWARD_PROPS
        const { page: route, query, name = false } = ResolveRouter(routes, to)

        let beforeLoading = true, _overlayTarget = null

        //加载前需要做逻辑处理
        if (Award_Loading != null) {
            //这里可以设置路由的生命周期
            beforeLoading = await Award_Loading.before({ to, query, route, name })
        }

        //加载之前的逻辑返回true，可以执行加载动作了
        if (beforeLoading) {

            //执行文件加载动画
            if (Award_Loading != null) {
                await Award_Loading.loading()
            } else {
                //没有main.js
                const { loading } = this.props
                if (!!loading && typeof loading === 'function') {
                    _overlayTarget = document.createElement('div')
                    document.getElementsByTagName('body')[0].appendChild(_overlayTarget)
                    ReactDOM.unstable_renderSubtreeIntoContainer(
                        this,
                        React.createElement(loading),
                        _overlayTarget
                    )
                }
            }

            //执行文件加载
            const Component = await routeLoader.loadPage(route)

            //执行文件执行
            if (Award_Loading != null) {
                Award_Loading.after({ Component, route, query, to, name })
            } else {
                let callback = () => {

                    changeHistory({ push, replace, to })

                    //如果是自定义的加载动画需要去掉
                    if (_overlayTarget != null) {
                        ReactDOM.unmountComponentAtNode(_overlayTarget) && _overlayTarget.remove()
                    }
                }
                routeLoader.notify({ Component, route, query, callback })
            }
        }
    }
}

//地址的回退 前进
//默认是main为true，即存在main.js
export async function popstate(main = true) { 
    if (main) {
        //配置了路由生命周期
        const { routeLoader, data: { routes, assetPrefix } } = this.context.AWARD_PROPS
        const { page: route, query, name = false } = ResolveRouter(routes)
        const to = location.href
        const beforeLoading = await this.before({ to, query, route, name })

        //加载之前的逻辑返回true，可以执行加载动作了
        if (beforeLoading) {
            await this.loading()
            const Component = await routeLoader.loadPage(route)
            this.after({ Component, route, query, to, name, history:false })
        }

    } else {
        // 没有配置路由生命周期，不管
        const { routeLoader } = this.props        
        const { page: route, query } = ResolveRouter(this.props.data.routes)
        const Component = await routeLoader.loadPage(route)
        routeLoader.notify({ Component, route, query })        
    }    
}

export function changeHistory({ push, replace, to }) { 
    push && window.history.pushState({ url: location.href, as: to }, null, to)
    replace && window.history.replaceState({ url: location.href, as: to }, null, to)
}