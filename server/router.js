import glob from 'glob-promise'
import { resolve, join } from 'path'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import render from './render'
import webpack from './build/webpack'
import clean from './build/clean'
import { replaceImages } from './compiler'

export default class Router {

    constructor(options) { 
        this.options = options
        
        this.dev = options.dev
        this.dir = options.dir
        this.dist = options.dist
        this.page = options.page
    }

    async routes() { 

        let _main = await glob('main.js', { cwd: this.dir })

        //设置了main.js
        if (_main.length) {

            this.options.entry = { 'bundles/main.js': join(this.dir, `main.js`) }
            this.options.dist = this.dev ? this.dist : '.tmp'
            
            const [compiler] = await Promise.all([
                webpack(this.options),
                clean(this.options)
            ])

            WebpackDevMiddleware(compiler, {
                publicPath: '/_swrn/webpack/',
                noInfo: true,
                quiet: true,
                clientLogLevel: 'warning'
            })

            return new Promise((resolve, reject) => {
                compiler.plugin('done', () => {
                    replaceImages(this.options).then(() => { 
                        resolve()
                    })  
                })
            }).then(async () => {                
                return await this.getConfigRoutes()
            })
            
        } else { 
            //未设置
            return await this.getRoutes()
        }
        
    }

    //这里获取的是默认路由
    async getRoutes() {

        const pages = await glob(`${this.page}/**/*.js`, { cwd: this.dir })

        const routes = []
        
        if (pages.length) {
            pages.map(item => {
                let _path = item.substr(0, item.length - 3).substr(4)
                _path = _path.split("/")
                _path.shift()

                let path, page, pop = false

                if (_path[_path.length - 1] == 'index') {
                    _path.pop()
                    pop = true
                }

                if (_path.length) {
                    const join = _path.join('/')
                    path = `/${join}`
                    page = `/${this.page}/` + join + (pop ? "/index" : '') + '.js'
                } else {
                    path = '/'
                    page = `/${this.page}/index.js`
                }

                routes.push({
                    page,
                    path
                })
            })
        }    

        return routes
    }

    //获取引用swrn/router的路由
    async getConfigRoutes() {
        global.SWRN_ROUTE = true
        let _Router
        const routePath = join(this.dir, `${this.dist}/dist/main.js`)
        _Router = require(routePath)
        const Router = _Router.default || _Router

        const routerHtml = render(Router)

        const singleRouter = /swrn_route=[\'\"]?([^\'\"]*)[\'\"]?/i

        const _routers = routerHtml.match(/swrn_route=[\'\"]?([^\'\"]*)[\'\"]?/gi)

        const routers = []

        if (!!_routers==true) {
            _routers.map(item => {
                let _tmp = item.match(singleRouter)
                _tmp = JSON.parse(_tmp[1].replace(/&quot;/g, '"'))

                _tmp.page = _tmp.render
                delete _tmp.render

                routers.push(_tmp)
            })
        }
        
        global.SWRN_ROUTE = false
        routers.push({ page: '/main.js', path: null })
        await clean(this.options)
        return routers
    }
}