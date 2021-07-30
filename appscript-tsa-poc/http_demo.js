
var http = require('http');
http.createServer(function (req, res) {
    setTimeout((function() {
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        res.end('{"employees":[{"name":"Udara","email":"udara@sample.com"},{"name":"Bob", "email":"bob@sample.com"},{"name":"John", "email":"john@sample.com"}]}');
      }), 300000);  
}).listen(8000);
