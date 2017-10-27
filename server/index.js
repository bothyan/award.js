const express = require('express')
const server = express()
const path = require('path')
const render = require('./render')
const axios = require('axios')
server.use('/static',express.static('./client/dist'));

// /page/index.js
server.get('/', async (req, res) => {

    const Index = require('./dist/page/index.js')

    const Component = Index.default || Index

    const props = await Component.getInitialProps({req,res})

    const html = render(Index.default, props)

    res.send(`
        <div id="wrap">${html}</div>
        <div id="data" data-state=${JSON.stringify(props)}></div>
        <script src="/static/main.js"></script>
        <script src="/static/page/index.js"></script>
    `)
})

server.get('/todo_list', async (req, res) => { 

    res.send({
        todoList:[{
            id:1,
            name: '完成redux-saga的学习',
            finish: false
        }, {
            id:2,
            name: '完成react-ssr的学习',
            finish: false    
        }]
    })
})


server.listen(4000, () => { 
    console.log('http://localhost:4000')
})

