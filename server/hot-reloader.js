import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import webpack from './build/webpack'
import clean from './build/clean'

export default class HotReloader { 
    
    constructor(server,dir,routes) { 
        this.server = server
        this.dir = dir
        this.routes = routes
    }

    async start() { 

        const [compiler] = await Promise.all([
            webpack(this.dir, this.routes),
            clean(this.dir)
        ])
                
        this.server.use(WebpackDevMiddleware(compiler, {
            publicPath: '/_swrn/webpack/',
            noInfo: true,
            quiet: true,
            clientLogLevel: 'warning'
        }))

        this.server.use(WebpackHotMiddleware(compiler,{
            path: '/_swrn/webpack-hmr',
            log: false,
            heartbeat: 2500
        }))

        return new Promise((resolve, reject) => { 
            compiler.plugin('done', () => { 
                resolve()
            })
        })
        
    }
}