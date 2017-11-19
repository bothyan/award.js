module.exports = (server) => { 
    server.get('/api/list', async (req, res) => { 
        
        res.send({
            list:[{
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
}