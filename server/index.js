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

    // 注册路由
    async registerRouter() {
        const { routes, exist_mainjs } = this._Resource.getParams()
        // 注册各个页面路由
        routes.map(async (item, index) => {

            // 注册该页面的静态资源的路由          
            this._Resource.registerPageSource(item.page)

            // 注册该页面动态地址
            item.path && this.server.get(item.path, async (req, res) => {

                let _Main = null
                //这里处理 路由钩子函数
                if (exist_mainjs.length) {
                    delete require.cache[require.resolve(exist_mainjs[0])]
                    _Main = require(exist_mainjs[0]).default
                    _Main.before && _Main.before({ req, res, routes })
                }

                this._Resource.render({ item, req, res, _Main })
            })
        })
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
        this._Resource = new Resource(options)

        await this._Resource.start()
    }

    //开启服务
    async start(port, hostname) {
        await this.prepare()
        await this.registerRouter()
        await this.server.listen(port, hostname)
    }
}
