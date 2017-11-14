import express from 'express'
import { resolve, join } from 'path'
import render from './render'
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

    async initRouter() { 
        this.routes.map(item => { 
            this.server.get(item.path, async (req, res) => { 
        
                let _Component,_Document,pageSourcePath = `bundles/page/${item.page}.js`
                if (process.env.NODE_ENV !== 'production') {

                    const documentPath = join(this.dir, `./.server/dist/page/document.js`)
                    const pagePath = join(this.dir,`./.server/dist/page/${item.page}.js`)

                    let documentFile = await glob(documentPath)

                    if (documentFile.length) { 
                        delete require.cache[require.resolve(documentPath)]    
                    }

                    //这里需要删除require的缓存
                    delete require.cache[require.resolve(pagePath)]
                            
                    
                    _Document = documentFile.length ? require(documentPath) : require('./document')
                    _Component = require(pagePath)
        
                } else { 
        
                    _Document = require(`./dist/page/document.js`)
                    _Component = require(`./dist/page/${item.page}.js`)
                    
                }
        
                const Component = _Component.default || _Component
                const Document = _Document.default || _Document        
            
                const props = !Component.getInitialProps ? {} : await Component.getInitialProps({ req, res })
                
                const html = render(Component, props)
        
                //资源路径
                const sourcePath = process.env.NODE_ENV !== 'production' ? `/_client/webpack/` : `/static/`
                
                const _html = render(Document, {
                    sourcePath,
                    page:pageSourcePath,
                    comProps:props,
                    html
                })
                
                res.send('<!DOCTYPE html>' + _html)
            })
        })
    }

    async prepare () {
        this.routes = await this.getRoutes()
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
