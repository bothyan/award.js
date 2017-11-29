import WebpackDevMiddleware from 'webpack-dev-middleware'
import Router from '../router'
import webpack from './webpack'
import clean from './clean'

export default async function build(dir, conf = null) {

    const options = {
        dir: dir,
        dev: false,
        dist: '.swrn',
        page: 'pages'
    }
    // 获取路由
    const routes = await new Router(options).routes()
    
    // webpack编译
    options.routes = routes
   
    options.entry = false
    
    const [compiler] = await Promise.all([
        webpack(options),
        clean(options)
    ])

    WebpackDevMiddleware(compiler, {
        noInfo: true,
        quiet: true,
        clientLogLevel: 'warning'
    })

    return new Promise((resolve, reject) => {
        compiler.plugin('done', () => {
            console.log('build done')
            resolve()
        })
    })

}
