const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
import webpackDevConfig from './webpack/hot_client'
const compiler = webpack(webpackDevConfig);

module.exports = class HotReloader { 
    constructor(server) { 
        this.server = server
    }

    start() { 
        this.server.use(webpackDevMiddleware(compiler, {
            publicPath: webpackDevConfig.output.publicPath,
            noInfo: true,
            stats: {
                colors: true
            }
        }))
        
        this.server.use(webpackHotMiddleware(compiler))
    }
}