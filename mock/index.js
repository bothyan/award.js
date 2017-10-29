module.exports = (server) => { 

    require('./todo')(server)
    require('./detail')(server)
    
}