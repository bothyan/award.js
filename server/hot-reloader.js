import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import webpack from './build/webpack'
import clean from './build/clean'
import { replaceStaticSource } from './compiler'

export default class HotReloader {

    constructor(options) {
        this.options = options
    }

    async start() {

        const [compiler] = await Promise.all([
            webpack(this.options),
            clean(this.options)
        ])

        this.options.server.use(WebpackDevMiddleware(compiler, {
            publicPath: '/_swrn/webpack/',
            noInfo: true,
            quiet: true,
            clientLogLevel: 'warning'
        }))

        this.options.server.use(WebpackHotMiddleware(compiler, {
            path: '/_swrn/webpack-hmr',
            log: false,
            heartbeat: 2500
        }))

        return new Promise((resolve, reject) => {
            compiler.plugin('done', async () => {
                replaceStaticSource(this.options).then(() => { 
                    resolve()
                })                
            })
        })

    }
}