var fs = require('fs');  // file system
var http = require('http');
var https = require('https')
const url = require('url');
const { ThrottleGroup } = require("stream-throttle");

/**
 * Change to various rate to test
 */
// var tg = new ThrottleGroup({rate: 1024*1024}); //1 MiB per sec
var tg = new ThrottleGroup({ rate: 1 * 1024 }); //1 kb per sec

var http = require('http');

http.createServer(onRequest).listen(8091);

function onRequest(client_req, client_res) {
    try{
        const query = url.parse(client_req.url,{parseQueryString: true}).query
        const fullHost = query.rHost;    
        const isHttps = fullHost.indexOf("https://") !== -1;
        const rHost =  !isHttps ? fullHost.slice(7) : fullHost.slice(8)
        var options = {
            hostname: rHost,
            port: isHttps ? 443 : 80,
            path: client_req.url,
            method: client_req.method,
            // headers: {
            //     ...client_req.headers,
            //     host: rHost,
            //     referer: `${fullHost}${client_req.url}`
            // }
        };
        // console.log(options)
    
        var proxy = (isHttps ? https : http).request(options, function (res) {
            client_res.writeHead(res.statusCode, res.headers)
            res
                .pipe(tg.throttle())
                .pipe(client_res, {
                    end: true
                });
        });
    
        client_req.pipe(proxy, {
            end: true
        })
    } catch(e) {
        client_res.writeHead(500, {'Content-Type': 'text/plain'});
        client_res.write(e.message);
        client_res.end();
    }    
}