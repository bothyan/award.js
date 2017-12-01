import WebpackDevMiddleware from 'webpack-dev-middleware'
import Router from '../router'
import webpack from './webpack'
import clean from './clean'
import { replaceStaticSource , replaceBundlesClassName } from '../compiler'

global.SWRN_InServer = true

export default async function build(dir, conf = null) {

    const dist = '.swrn'

    const options = {
        dir: dir,
        dev: false,
        dist,
        page: 'pages',
        assetPrefix: '/swrn'
    }

    // 获取路由
    const routes = await new Router(options).routes()
    
    // webpack编译
    options.routes = routes
    options.dist = dist    
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
        compiler.plugin('done', async () => {  
            await replaceStaticSource(options)
            await replaceBundlesClassName(options)             
            console.log('build done') 
            resolve() 
        })
    })

}
