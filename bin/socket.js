let socketServer = require('socket.io');

let io = null;

module.exports = {
    connect: function (httpServer) {
        if (!io && httpServer) {
            io = socketServer(httpServer);
        }
        return io;
    },
    getIo(){
        return io;
    }
};