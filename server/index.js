import express from 'express'
import React from 'react'
import { resolve, join } from 'path'
import render, { serveStatic } from './render'
import HotReloader from './hot-reloader'
import axios from 'axios'
import parseArgs from 'minimist'
import glob from 'glob-promise'

require('babel-register')({
    presets: ['react', 'es2015']
});

/**
 * 注册express路由
 * 包括静态资源、react-router、mock数据(api地址)
 */
//server.use('/static', express.static('./client/dist'))

export default class Server { 
    constructor({ dir }) { 
        this.dir = resolve(dir)
        this.routes = []
        this.server = express()
    }


    //这里获取的是默认路由
    async getRoutes() {

        let routes = await glob('routes.js', { cwd: this.dir })
        const mocks = await glob('mock/**/*.js', { cwd: this.dir })
        const pages = await glob('page/**/*.js', { cwd: this.dir })
        
        if (mocks.length) {
            require(join(this.dir, './mock'))(this.server)
        }
        
        if (routes.length) {
            routes = require(join(this.dir, './routes'))
        } else { 
            routes = []
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
                    page = join + ( pop ? "/index" : '')
                } else {
                    path = '/'
                    page = 'index'
                }
                    
                routes.push({
                    page,
                    path,
                    exact: true
                })
            })
        } 

        return routes
    }

    //获取引用swrn/router的路由
    async getConfigRoutes() {
        global.SWRN_ROUTE = true
        let _Router
        const routePath = join(this.dir, `./.server/dist/main.js`)
        _Router = require(routePath)
        const Router = _Router.default || _Router

        const routerHtml = render(Router)            
        
        const singleRouter = /swrn_route=[\'\"]?([^\'\"]*)[\'\"]?/i

        const _routers = routerHtml.match(/swrn_route=[\'\"]?([^\'\"]*)[\'\"]?/gi)

        const routers = []

        _routers.map(item => { 
            let _tmp = item.match(singleRouter)
            _tmp = JSON.parse(_tmp[1].replace(/&quot;/g, '"'))

            _tmp.page = _tmp.render
            delete _tmp.render
            
            routers.push(_tmp)

        })
        global.SWRN_ROUTE = false
        return routers
    }

    async initRouter() { 
        console.log(this.routes)
        this.routes.map(item => { 
            this.server.get(item.path, async (req, res) => { 
        
                let _Component,_Document,_Router,pageSourcePath = join('bundles',item.page)
                if (process.env.NODE_ENV !== 'production') {

                    const documentPath = join(this.dir, `./.server/dist/page/document.js`)
                    const pagePath = join(this.dir, './.server/dist/',item.page)
                    const routePath = join(this.dir, `./.server/dist/main.js`)                    

                    let documentFile = await glob(documentPath)

                    if (documentFile.length) { 
                        delete require.cache[require.resolve(documentPath)]    
                    }

                    //这里需要删除require的缓存
                    delete require.cache[require.resolve(pagePath)]
                            
                    
                    _Document = documentFile.length ? require(documentPath) : require('./document')
                    _Component = require(pagePath)
                    _Router = require(routePath)
        
                } else { 
        
                    _Document = require(`./dist/page/document.js`)
                    _Component = require(`./dist/page/${item.page}.js`)
                    
                }

                const Router =  _Router.default || _Router
                let Component = _Component.default || _Component
                const Document = _Document.default || _Document  
                
                
                
                const props = !Component.getInitialProps ? {} : await Component.getInitialProps({ req, res })
                
                //Component = React.createElement(Component,null,Router)

                const html = render(Component, props)
        
                //资源路径
                const sourcePath = process.env.NODE_ENV !== 'production' ? `/swrn/` : `/static/`
                
                const _html = render(Document, {
                    sourcePath,
                    page:pageSourcePath,
                    comProps:props,
                    html
                })
                
                res.send('<!DOCTYPE html>' + _html)
            })
        })

        this.server.get('/swrn/main.js', async (req, res) => { 
            const path = join(this.dir,'.server', 'main.js')
            return await serveStatic(req, res, path)
        })

        this.server.get('/swrn/bundles/page/index.js', async (req, res) => { 
            const path = join(this.dir,'.server', 'bundles/page/index.js')
            return await serveStatic(req, res, path)
        })

        this.server.get('/swrn/bundles/page/home/mine/index.js', async (req, res) => { 
            const path = join(this.dir,'.server', 'bundles/page/home/mine/index.js')
            return await serveStatic(req, res, path)
        })
    }

    async prepare () {
        this.routes = await this.getRoutes()
        this.routes = await this.getConfigRoutes()

        await this.initRouter()
        await new HotReloader(this.server,this.dir,this.routes).start()
    }

    async start(prot, hostname) {
        if (process.env.NODE_ENV !== 'production') {
           await this.prepare()
        }
        this.server.listen(4000, () => { 
            console.log('http://localhost:4000')
        })
    }   
}
