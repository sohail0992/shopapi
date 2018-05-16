module.exports.updateProductRealTime = function(io){
    //var updateProductIo = io.of('/updateProduct');
    console.log("socket controller accessed");
    io.on('connection', function(socket){
        console.log("socket controller /updateProduct End point accesse");
        socket.on('updateProduct', function(data){
            console.log("Data recieved on the server side");
            console.log(data);
            io.sockets.emit('updateProduct', data);
        })
    });
}