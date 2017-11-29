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
    }

    // 注册路由
    async registerRouter(routes) {

        // 客户端入口文件路由
        this.server.get('/swrn/main.js', async (req, res) => {
            const path = join(this.dir, this.dist, 'main.js')
            return await serveStatic(req, res, path)
        })

        // 注册各个页面路由
        routes.map(async (item, index) => {
     
            //获取动态页面渲染
            item.path && this.server.get(item.path, async (req, res) => {                

                let _Component = null, _Main = null

                //if (this.dev) {
                    //开发
                    const ComponentPath = join(this.dir, `./${this.dist}/dist/`, item.page)
                    const MainPath = join(this.dir, `./${this.dist}/dist/main.js`)

                    //这里需要删除require的缓存
                    delete require.cache[require.resolve(ComponentPath)]
                    _Component = require(ComponentPath)

                    const mainFile = await glob(MainPath)
                    if (mainFile.length) {
                        delete require.cache[require.resolve(MainPath)]
                        _Main = require(MainPath)
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
        this.server.get(`/swrn/bundles${page}`, async (req, res) => {
            const path = join(this.dir, this.dist, `bundles/${page}`)
            return await serveStatic(req, res, path)
        })

        //获取css
        if (!this.dev) {
            this.server.get(`/swrn/style/bundles${page}.css`, async (req, res) => {
                const path = join(this.dir, this.dist, `style/bundles/${page}.css`)
                return await serveStatic(req, res, path)
            })
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
            page: this.page
        }
        // 获取路由
        const routes = await new Router(options).routes()

        // 注册路由
        await this.registerRouter(routes)

        // webpack编译
        if (this.dev) {
            options.routes = routes
            options.dist = this.dist
            options.entry = false
            await new HotReloader(options).start()
        }    
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

        let html, props = { ...initialProps, route:page, query, routes}

        if (Main) {
            props = { ...props, Component, Main }
            html = renderToStaticMarkup(React.createElement(App, props), props)
        } else {
            html = render(Component, props)
        }

        //资源路径
        const sourcePath = `/swrn/`

        const mainBundle = Main ? sourcePath + 'bundles/main.js' : null
        const mainPath = sourcePath + 'main.js'
        const jsPath = sourcePath + join('bundles', page)
        let cssPath = null

        const _cssPath = await glob(join(this.dir, this.dist , 'style', 'bundles', page + '.css'))
        
        if (_cssPath.length) {
            cssPath = sourcePath + join('style', 'bundles', page + '.css')
        }    

        const _html = render(Document, {
            mainBundle,
            mainPath,
            jsPath,
            cssPath,
            props,
            html
        })

        res.send('<!DOCTYPE html>' + _html)
    }
}
