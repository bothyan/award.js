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

routes.map(item => { 
    server.get(item.path, async (req, res) => { 

        const _Component = require(`./dist/page/${item.page}.js`)
        
        const Component = _Component.default || _Component
    
        const props = await Component.getInitialProps({ req, res })
        
        const html = render(Component, props)
    
        res.send(`
            <html>
                <head>
                    <title>首页</title>
                    <link rel="stylesheet" type="text/css" href="/static/style/app.css" />
                </head>
                <div id="wrap">${html}</div>
                <div id="data" data-state=${JSON.stringify(props)}></div>
                <script src="/static/main.js"></script>
                <script src="/static/page/index.js"></script>
            </html>
        `)
    })
})

server.listen(4000, () => { 
    console.log('http://localhost:4000')
})

