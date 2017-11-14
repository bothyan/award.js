module.exports = (server) => {
    server.get('/todo_detail', async (req, res) => {
    
        res.send({
            todoDetail: '这是todoList的详情'
        })
    })
}