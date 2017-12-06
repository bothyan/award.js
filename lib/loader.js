import EventEmitter from './EventEmitter'

export default class Loader { 

    constructor(assetPrefix) { 
        
        this.assetPrefix = assetPrefix
        this.dev = process.env.NODE_ENV == 'development'
        this.currentRoute = ''

        this.pageCache = {}

        this.pageRegisterEvents = new EventEmitter()
        this.loadingRoutes = {}

        this.subscriptions = new Set()
        
    }

    // 加载资源进行判断区分
    loadPage(route) { 
        return new Promise((resolve, reject) => { 

            //定义 加载完毕执行触发的内容，即触发回调
            const fire = (data) => { 
                this.pageRegisterEvents.off(route)
                delete this.loadingRoutes[route]
                resolve(data)
            }

            //查询是否有缓存 路由
            const cachePage = this.pageCache[route]

            if (route == '/main.js' || cachePage) {
                this.currentRoute = route
                resolve(cachePage)
                return
            }

            //将当前路由注册到事件监听上，监听触发，执行fire回调
            this.pageRegisterEvents.on(route, fire)
            
            //如果服务端渲染就不需要了
            if (document.getElementById(`__AWARD_PAGE__${route}`)) { 
                return
            }

            //开始加载页面所需要的资源，包括js、css
            if (!this.loadingRoutes[route]) { 
                this.loadSource(route)
                this.loadingRoutes[route] = true
            }
        })
    }

    //发起资源加载操作
    loadSource(route) { 

        //发布环境下需要加载css文件
        if (!this.dev) {
            const style = document.createElement('link')
            style.rel = "stylesheet"
            style.href = `${this.assetPrefix}/static/style${route.split('.')[0]}.css`
            document.head.appendChild(style)
        }

        //加载js文件
        const script = document.createElement('script')
        script.src = `${this.assetPrefix}${route}`
        script.type = 'text/javascript'
        document.body.appendChild(script)
    }

    //新页面加载进来，需要触发路由的注册事件
    registerPage(route, fn) {
        const register = () => { 
            const component = fn()
            this.pageCache[route] = component            
            this.pageRegisterEvents.emit(route,component)
        }

        //记录当前路由
        if (route != '/main.js') { 
            this.currentRoute = route
        }

        register()
    }

    subscribe(fn) {         
        this.subscriptions.add(fn)
        return () => this.subscriptions.delete(fn)
    }

    //这里是用于热更新时触发
    update(data) {
        data.route = this.currentRoute
        this.notify(data)
    }

    notify(data) {
        this.subscriptions.forEach((fn) => fn(data))
    }
}
