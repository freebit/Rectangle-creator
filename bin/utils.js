module.exports = (server, debug) => {
  return {
    errorHandler(error){
      if (error.syscall !== 'listen') {
        throw error;
      }
    
      let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    
      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' не хватает прав');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' уже используется');
          process.exit(1);
          break;
        default:
          throw error;
      }
    },

    listeningHandler() {
      const addr = server.address();
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      
      debug('Listening on ' + bind);
    }
  }
}