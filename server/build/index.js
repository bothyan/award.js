import WebpackDevMiddleware from 'webpack-dev-middleware'
import Router from '../router'
import webpack, { buildWebpack } from './webpack'
import clean, { cleanBundles,cleanFile } from './clean'
import { replaceStaticSource } from '../compiler'

global.AWARD_InServer = true

export default async function build(dir, conf = null) {

    const dist = '.award'

    const options = {
        dir: dir,
        dev: false,
        dist,
        page: 'pages',
        assetPrefix: '/award'
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
            console.log('build done 50%')
            
            const [compilerBuild] = await Promise.all([
                buildWebpack(options),
                cleanBundles(options)
            ])

            WebpackDevMiddleware(compilerBuild,{
                noInfo: true,
                quiet: true,
                clientLogLevel: 'warning'
            })

            compilerBuild.plugin('done', async () => { 
                
                options.fileName = 'common.js'
                await cleanFile(options)
                options.fileName = 'app.js'
                await cleanFile(options)
                options.fileName = 'manifest.js'
                await cleanFile(options)

                console.log('build done 100%')
                
                resolve() 
            })            
        })
    })

}
