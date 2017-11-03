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

        let _Component,_Document
        if (process.env.NODE_ENV !== 'production') {
            //这里需要删除require的缓存
            delete require.cache[require.resolve(`../.server/page/${item.page}.js`)]
            delete require.cache[require.resolve(`../.server/page/document.js`)]            
            
            _Document = require(`../.server/page/document.js`)
            _Component = require(`../.server/page/${item.page}.js`)

        } else { 

            _Document = require(`./dist/page/document.js`)
            _Component = require(`./dist/page/${item.page}.js`)
            
        }

        const Component = _Component.default || _Component
        const Document = _Document.default || _Document        
    
        const props = await Component.getInitialProps({ req, res })
        
        const html = render(Component, props)

        //资源路径
        const sourcePath = process.env.NODE_ENV !== 'production' ? '/_client/webpack/' : '/static/'
        
        const _html = render(Document, {
            sourcePath,
            comProps:props,
            html
        })
        
        res.send('<!DOCTYPE html>' + _html)
    })
})

server.listen(4000, () => { 
    console.log('http://localhost:4000')
})

