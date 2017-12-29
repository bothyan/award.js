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
        } catch (err) {
            console.log(err)
        }
        
        this.server.get('*', async (req, res) => {
            if (req.url.match(/\.(json|map)/) != null) {
                return
            } else {
                await this.handleRequestAndResponse(req, res, null, {
                    err: true,
                    statusCode: 404,
                    message: '找不到页面',
                    stack: ''
                })
            }    
        })

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
            item.path && this.server.get(item.path, async (req, res, next) => {
                await this.handleRequestAndResponse(req, res, item.page)
            })
        })
    }

    // 处理请求和响应
    async handleRequestAndResponse(req, res, page, error = {}) {

        const { exist_errorjs } = this._Resource.getParams()        

        const { err = false, statusCode = 200, message = '', stack = '' } = error

        error = { err, statusCode, message, stack }

        try {
            if (err) { 
                throw error
            }
            await this.render({ req, res, page, error })
        } catch (_error) {
            // 刷新的页面语法错误 捕获错误
            if (exist_errorjs.length) {
                //存在错误页面
                try {
                    error = {
                        err: true,
                        statusCode: _error.statusCode || 500,
                        message: _error.message,
                        stack: _error.stack
                    }

                    page = '/error.js'
                
                    await this.render({ req, res, page, error })

                } catch (_err) {
                    //处理 自定义的错误 出现语法错误
                    await this._Resource.renderError({
                        req, res, error: {
                            err: true,
                            statusCode: 500,
                            message: _err.message,
                            stack: _err.stack
                        }
                    })
                }
            } else { 
                //不存在错误页面
                await this._Resource.renderError({
                    req, res, error: {
                        err: true,
                        statusCode: _error.statusCode || 500,
                        message: _error.message,
                        stack: _error.stack
                    }
                })
            }    
        }
    }

    async render({ req, res, page, error }) {
        const { routes, exist_mainjs, exist_errorjs } = this._Resource.getParams()

        let _Main = null
        // 这里处理 路由钩子函数
        if (exist_mainjs.length) {
            delete require.cache[require.resolve(exist_mainjs[0])]
            _Main = require(exist_mainjs[0]).default
            _Main.before && _Main.before({ req, res, routes })
        }
        const html = await this._Resource.render({ req, res, page, _Main, error })

        res.status(error.statusCode).send(html)
    }
}
