const express = require('express')
const server = express()
const path = require('path')
const render = require('./render')

server.use('/static',express.static('./client/dist'));

// /page/index.js
server.get('/', (req, res) => {

    const Index = require('./dist/page/index.js')
    const html = render(Index.default)

    res.send(`
    <div id="wrap">${html}</div>
    <script src="/static/page/index.js"></script>
`)
})


server.listen(4000, () => { 
    console.log('http://localhost:4000')
})

