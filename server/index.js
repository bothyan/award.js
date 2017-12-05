import express from 'express'
import React from 'react'
import { resolve, join } from 'path'
import render, { serveStatic } from './render'
import HotReloader from './hot-reloader'
import Router from './router'
import glob from 'glob-promise'
import Document from './document'
import App from '../lib/app'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'

require('babel-register')({
    presets: ['react', 'es2015']
})

global.SWRN_InServer = true

/**
 * 注册express路由
 * 包括静态资源、react-router、mock数据(api地址)
 */

export default class Server {
    constructor({ dev = false, dir }) {
        this.dir = resolve(dir)
        this.dev = dev
        this.server = express()
        this.dist = '.swrn'
        this.page = 'pages'

        this.assetPrefix = '/swrn'
        this.exist_mainjs = false
        this.exist_maincss = false
    }

    // 注册路由
    async registerRouter(routes) {

        this.exist_mainjs = await glob(join(this.dir, `./${this.dist}/dist/main.js`))
        this.exist_maincss = await glob(join(this.dir, this.dist, 'static/style/bundles/main.js.css'))


        //js入口文件
        this.server.get(`${this.assetPrefix}/main.js`, async (req, res) => {
            const path = join(this.dir, this.dist, 'main.js')
            return await serveStatic(req, res, path)
        })

        if (this.exist_mainjs.length) {
            // 客户端入口文件 js
            this.server.get(`${this.assetPrefix}/static/main.js`, async (req, res) => {
                const path = join(this.dir, this.dist, `bundles/main.js`)
                return await serveStatic(req, res, path)
            })
        }

        if (this.exist_maincss.length) {
            // 客户端入口文件 css
            this.server.get(`${this.assetPrefix}/static/style/main.css`, async (req, res) => {
                return await serveStatic(req, res, this.exist_maincss[0])
            })
        }

        // 注册各个页面路由
        routes.map(async (item, index) => {

            //获取动态页面渲染
            item.path && this.server.get(item.path, async (req, res) => {

                let _Component = null, _Main = null

                //if (this.dev) {
                //开发
                const ComponentPath = join(this.dir, `./${this.dist}/dist/`, item.page)

                //这里需要删除require的缓存
                delete require.cache[require.resolve(ComponentPath)]
                _Component = require(ComponentPath)

                if (this.exist_mainjs.length) {
                    delete require.cache[require.resolve(this.exist_mainjs[0])]
                    _Main = require(this.exist_mainjs[0])
                }

                //} else {

                //发布

                //}

                const Component = _Component.default || _Component
                const Main = !!_Main && (_Main.default || _Main)

                await this.renderHtml({
                    req,
                    res,
                    Main,
                    Component,
                    routes,
                    page: item.page
                })

            })

            // 注册该页面的静态路由            
            this.publicSource(item.page)
        })

        //注册mock路由
        this.mockData()
    }

    //静态资源处理，包括css、js、images...
    async publicSource(page) {

        //获取js
        this.server.get(`${this.assetPrefix}${page}`, async (req, res) => {
            const path = join(this.dir, this.dist, `bundles/${page}`)
            return await serveStatic(req, res, path)
        })

        //获取资源
        //开发使用css内联模式  发布使用链接模式（缓存）
        if (!this.dev) {

            //特殊处理css资源
            this.server.get(`${this.assetPrefix}/static/style${page.split('.')[0]}.css`, async (req, res) => {
                const path = join(this.dir, this.dist, `static/style/bundles/${page}.css`)
                return await serveStatic(req, res, path)
            })

            //获取图片资源
            this.server.use(`${this.assetPrefix}/static`, express.static(join(this.dir, this.dist, 'static')))
        }

    }

    // mock数据
    async mockData() {
        const mocks = await glob('mock/**/*.js', { cwd: this.dir })
        if (mocks.length) {
            mocks.map(item => {
                require(join(this.dir, item))(this.server)
            })
        }
    }

    //服务预处理
    async prepare() {
        const options = {
            dir: this.dir,
            dev: this.dev,
            server: this.server,
            dist: this.dist,
            page: this.page,
            assetPrefix: this.assetPrefix
        }
        // 获取路由
        const routes = await new Router(options).routes()

        // webpack编译
        if (this.dev) {
            options.routes = routes
            options.dist = this.dist
            options.entry = false
            await new HotReloader(options).start()
        }

        // 注册路由
        await this.registerRouter(routes)
    }

    //开启服务
    async start(port, hostname) {
        await this.prepare()
        await this.server.listen(port, hostname)
    }

    //send Html资源
    async renderHtml({ req, res, page, routes, Component, Main }) {

        const query = req.params
        const initialProps = !Component.getInitialProps ? {} : await Component.getInitialProps({ req, res })

        let html, props = { ...initialProps, route: page, query, routes}

        if (Main) {
            props = { ...props , Component, Main }
            html = renderToStaticMarkup(React.createElement(App, props), props)
        } else {
            html = render(Component, props)
        }

        //css、js资源地址配置
        let cssPath = []
        let jsPath = [] //主要依赖的文件，也就是客户端入口

        //客户端路由自定义配置页面
        if (Main) {
            jsPath.push({
                route:'/main.js',
                src:join(this.assetPrefix, 'static/main.js')
            })
        }
        
        //当前页面需要的js文件
        jsPath.push({
            route: page,
            src:join(this.assetPrefix, page)
        },{
            route: '',
            src:join(this.assetPrefix, '/main.js')
        })

        //判断是否有css，一个是当前页面 一个是公共的
        const _cssPath = await glob(join(this.dir, this.dist, 'static/style/bundles', page + '.css'))

        if (this.exist_maincss.length) {
            cssPath.push(`${this.assetPrefix}/static/style/main.css`)
        }

        if (_cssPath.length) {
            cssPath.push(`${this.assetPrefix}/static/style${page.split('.')[0]}.css`)
        }

        props.assetPrefix = this.assetPrefix

        const _html = render(Document, {
            jsPath,
            cssPath,
            props,
            html
        })

        res.send('<!DOCTYPE html>' + _html)
    }
}
