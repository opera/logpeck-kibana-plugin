var http = require('http');
exports.post = function(hostPort, path, method, bodyData, timeout = 200) {
  return new Promise(function(resolve, reject) {
    var host;
    try {
      host = hostPort.split(':');
    } catch (e) {
      resolve ({"data": null, "err": e.toString()});
    }
    if (host.length != 2) {
      resolve ({"data": null, "err": "Ip format error"});
    }
    const options = {
      hostname: host[0],
      port: host[1],
      path: path,
      method: method,
    };

    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        //console.log(`响应主体: ${chunk}`);
        resolve ({"data": chunk, "err": null});
      });
      /*console.log(`状态码: ${res.statusCode}`);
      console.log(`响应头: ${JSON.stringify(res.headers)}`);
      res.on('end', () => {
        console.log('响应中已无数据');
      });
      */
    });

    req.setTimeout(timeout, function () {
      resolve ({"data": null, "err": "connect ETIMEDOUT" + hostPort});
    });

    req.on('error', (e) => {
      //console.error(`请求遇到问题: ${e.message}`);
      resolve ({"data": null, "err": e.message});
    });

    req.write(bodyData);
    req.end();
  });
}
