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
            publicPath: '/_client/webpack/',
            noInfo: true,
            quiet: true,
            clientLogLevel: 'warning'
        }))

        this.server.use(WebpackHotMiddleware(compiler,{
            path: '/_client/webpack-hmr',
            log: false,
            heartbeat: 2500
        }))
    }
}