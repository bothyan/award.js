import express from 'express'
import glob from 'glob-promise'
import { existsSync } from 'fs'
import { resolve, join } from 'path'
import HotReloader from './hot-reloader'
import Router from './router'
import { serveStatic,renderHtml,renderError } from './render'

/**
 * 统一处理Award需要的静态资
 */
export default class Resource {
    constructor({ dir, dev, server, dist, page, assetPrefix }) {
        this.dir = dir
        this.dev = dev
        this.server = server
        this.dist = dist
        this.page = page
        this.assetPrefix = assetPrefix

        this.options = { dir, dev, server, dist, page, assetPrefix }

        this.routes = []

        this.exist_mainjs = false
        this.exist_maincss = false        
    }

    // 拿参数
    getParams() { 
        return {
            routes: this.routes,
            exist_mainjs: this.exist_mainjs
        }
    }

    async start() {
        await this.router()
        await this.complier()
        await this.registerBaseSource()
        await this.mock()
    }

    // 获取路由
    async router() {
        // 获取
        this.routes = await new Router(this.options).routes()
    }

    // webpack编译
    async complier() {
        if (this.dev) {
            this.options.routes = this.routes
            this.options.dist = this.dist
            this.options.entry = false
            await new HotReloader(this.options).start()
        }
    }

    // 注册必要的静态资源请求地址
    async registerBaseSource() {

        this.exist_mainjs = await glob(join(this.dir, `./${this.dist}/dist/main.js`))
        this.exist_maincss = await glob(join(this.dir, this.dist, 'static/style/bundles/main.js.css'))

        //客户端入口的js文件
        this.server.get(`${this.assetPrefix}/main.js`, async (req, res) => {
            const path = join(this.dir, this.dist, 'main.js')
            return await serveStatic(req, res, path)
        })

        if (this.exist_mainjs.length) {
            //客户端组件入口的js文件，即main.js
            this.server.get(`${this.assetPrefix}/static/main.js`, async (req, res) => {
                const path = join(this.dir, this.dist, `bundles/main.js`)
                return await serveStatic(req, res, path)
            })
        }

        if (this.exist_maincss.length) {
            //客户端入口的css文件
            this.server.get(`${this.assetPrefix}/static/style/main.css`, async (req, res) => {
                return await serveStatic(req, res, this.exist_maincss[0])
            })
        }


        if (!this.dev) {
            //获取图片、字体等资源
            this.server.use(`${this.assetPrefix}/static`, express.static(join(this.dir, this.dist, 'static')))
        }

    }

    // mock数据
    async mock() {
        const mocks = await glob('mock/**/*.js', { cwd: this.dir })
        if (mocks.length) {
            mocks.map(item => {
                require(join(this.dir, item))(this.server)
            })
        }
    }

    // 注册单页面需要的静态资源
    async registerPageSource(page) {
        //单个页面请求的js地址，即bundle文件的chunkPage
        this.server.get(`${this.assetPrefix}${page}`, async (req, res) => {
            const path = join(this.dir, this.dist, `bundles/${page}`)
            return await serveStatic(req, res, path)
        })

        //单个页面需要的css资源及其他静态资源
        if (!this.dev) {
            //单个页面需要的css资源地址
            this.server.get(`${this.assetPrefix}/static/style${page.split('.')[0]}.css`, async (req, res) => {
                const path = join(this.dir, this.dist, `static/style/bundles/${page}.css`)
                if (existsSync(path)) {
                    return await serveStatic(req, res, path)
                } else {
                    res.send('')
                }
            })
        }
    }

    // 渲染静态资源
    async render({ req, res, item, _Main }) {
        let _Component = null

        const ComponentPath = join(this.dir, `./${this.dist}/dist/`, item.page)

        //这里需要删除require的缓存
        delete require.cache[require.resolve(ComponentPath)]
        _Component = require(ComponentPath)

        const Component = _Component.default || _Component
        const Main = !!_Main && (_Main.default || _Main)

        await renderHtml({
            req,
            res,
            page: item.page,
            routes: this.routes,  
            Component,   
            Main,                     
            dev: this.dev,
            dir: this.dir,
            dist: this.dist,
            assetPrefix: this.assetPrefix,
            exist_maincss: this.exist_maincss
        })
    }

    // 渲染错误页面
    async renderError({ req, res, error}) { 
        if (this.dev) { 
            await renderError({
                req,
                res,
                error
            })
        }
    }
}