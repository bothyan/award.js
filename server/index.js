const express = require('express')
const server = express()
const path = require('path')
const render = require('./render')
const axios = require('axios')
const routes = require('../routes')

/**
 * 注册express路由
 * 包括静态资源、react-router、mock数据(api地址)
 */
server.use('/static', express.static('./client/dist'))
require('../mock')(server)
const HotReloader = require('./hot-reloader')

if (process.env.NODE_ENV !== 'production') {
    const hot = new HotReloader(server)
    hot.start()
}


routes.map(item => { 
    server.get(item.path, async (req, res) => { 

        let _Component
        if (process.env.NODE_ENV !== 'production') {
            //这里需要删除require的缓存
            delete require.cache[require.resolve(`../.server/page/${item.page}.js`)]
            
            _Component = require(`../.server/page/${item.page}.js`)

        } else { 

            _Component = require(`./dist/page/${item.page}.js`)
            
        }

        const Component = _Component.default || _Component
    
        const props = await Component.getInitialProps({ req, res })
        
        const html = render(Component, props)

        //资源路径
        const sourcePath = process.env.NODE_ENV !== 'production' ? '/_client/webpack/' : '/static/'

        res.send(`
            <html>
                <head>
                    <title>首页</title>
                    <link rel="stylesheet" type="text/css" href="${sourcePath}style/app.css" />
                </head>
                <div id="wrap">${html}</div>
                <div id="data" data-state=${JSON.stringify(props)}></div>
                <script src="${sourcePath}main.js"></script>
                <script src="${sourcePath}app.js"></script>
            </html>
        `)
    })
})

server.listen(4000, () => { 
    console.log('http://localhost:4000')
})

