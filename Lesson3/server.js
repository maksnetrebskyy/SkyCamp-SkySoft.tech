let http = require('http');
let fs = require('fs');
let path = require('path');

http.createServer(function(req, res){
    if(req.url === "/"){
        fs.readFile('index.html', null, function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    }
    else if(req.url.match('style.css')){
        var cssPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(cssPath);
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);
    }
    else{
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("404 Not Found");
    }

}).listen(3000, () => console.log('Server work'));

