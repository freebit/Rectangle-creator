#!/usr/bin/env node

const app = require('../express/expressApp');
const debug = require('debug')('rectangle-creator:server');
const http = require('http');


const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

const utils = require('./utils')(server, debug);

server.listen(port, () => console.log(`Rectangle-creator app listening on port ${ port }!`) );

server.on('error', utils.errorHandler);
server.on('listening', utils.listeningHandler);