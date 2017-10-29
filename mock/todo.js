module.exports = (server) => { 
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
}