import express from 'express'
import { resolve } from 'path'
import Resource from './resource'

require('babel-register')({
    presets: ['react', 'es2015']
})

global.AWARD_InServer = true

/**
 * 服务端主入口
 */

export default class Server {
    constructor({ dev = false, dir }) {
        this.dir = resolve(dir)
        this.dev = dev
        this.server = express()
        this.dist = '.award'
        this.page = 'pages'
        this.assetPrefix = '/award'

        this._Resource = {}
    }

    //开启服务
    async start(port, hostname) {
        try {
            await this.prepare()
            await this.registerRouter()
            await this.registerOtherRouter()
        } catch (err) {
            console.log(err)
        }
        await this.server.listen(port, hostname)
    }

    // 服务预处理
    async prepare() {
        const options = {
            dir: this.dir,
            dev: this.dev,
            server: this.server,
            dist: this.dist,
            page: this.page,
            assetPrefix: this.assetPrefix
        }
        this._Resource = new Resource(options)

        await this._Resource.start()
    }

    // 注册项目路由
    async registerRouter() {
        const { routes } = this._Resource.getParams()
        // 注册各个页面路由
        routes.map(async (item, index) => {

            // 注册该页面的静态资源的路由          
            this._Resource.registerPageSource(item.page)

            // 注册该页面动态地址
            item.path && this.server.get(item.path, async (req, res) => {
                await this.handleRequestAndResponse(req, res, item.page)
            })
        })
    }

    // 处理请求和响应
    async handleRequestAndResponse(req, res, page, { err = false, code = '', msg = '', stack='' } = {}) {
        const { routes, exist_mainjs, exist_errorjs} = this._Resource.getParams()
        try {
            let _Main = null
            // 这里处理 路由钩子函数
            if (exist_mainjs.length) {
                delete require.cache[require.resolve(exist_mainjs[0])]
                _Main = require(exist_mainjs[0]).default
                _Main.before && _Main.before({ req, res, routes })
            }

            await this._Resource.render({ page, req, res, _Main, error:{
                err,
                code,
                msg,
                stack
            }})

        } catch (err) {
            // 捕获错误
            if (exist_errorjs.length) {
                await this.handleRequestAndResponse(req, res, '/error.js', {
                    err: true,
                    code: 500,
                    msg: err.message,
                    stack:err.stack
                })
            } else {
                await this._Resource.renderError({
                    req, res, error: err
                })
            }
        }
    }

    // 注册其他路由
    async registerOtherRouter() {

        // 404 页面
        this.server.get('*', async (req, res) => {
            const { exist_errorjs } = this._Resource.getParams()
            if (exist_errorjs.length) {
                await this.handleRequestAndResponse(req, res, '/error.js', {
                    err: true,
                    code: 404,
                    msg: '找不到页面',
                    stack: ''
                })
            } else {
                await this._Resource.renderError({
                    req, res, error: {
                        code: '404',
                        message: '页面找不到'
                    }
                })
            }
        })
    }
}
