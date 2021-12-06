const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

class HTTPServer {
    static serve() {
        server.listen(5000, () => {
            console.log('listening on *:5000');
        });
    }
}

module.exports = {HTTPServer, server};
