(function(){
    const {HTTPServer} = require("./server/HTTPServer.js");
    const ws = require("./server/WS.js");

    HTTPServer.serve();
    ws.initWS();
}());
