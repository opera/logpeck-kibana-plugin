var Config = require('./config');
var Http = require('./util/http');
export default function (server) {
  server.route([
    {
      path: '/api/logpeck/version',
      method: 'POST',
      handler(req, reply) {
        var ip = req.payload.ip;
        reply(Http.post(ip, '/version', 'POST', ""));
      }
    },
    {
      path: '/api/logpeck/list',
      method: 'POST',
      handler(req, reply) {
        var ip=req.payload.ip;
        Http.post(ip, '/peck_task/list', 'POST', "").then((res)=> {
          if (res.err) {
            res = {"data":null,"err":res.err};
            reply(res);
          } else {
            var list = JSON.parse(res.data);
            var task = {"configs": [], "stats": []};
            if (list["configs"] == null) {
              reply({"data":task,"err":null});
            } else {
              var configs = {};
              var stats = {};
              for (var id = 0; id < list["configs"].length; id++) {
                configs[list["configs"][id]['Name']] = list["configs"][id];
              }
              for (var id = 0; id < list["stats"].length; id++) {
                stats[list["stats"][id]['Name']] = list["stats"][id];
              }
              task = {"configs": configs, "stats": stats};
              reply({"data":task,"err":null});
            }
          }
        });
      }
    },
    {
      path: '/api/logpeck/start',
      method: 'POST',
      handler(req, reply) {
        var name=req.payload.Name;
        var ip=req.payload.ip;
        Http.post(ip, '/peck_task/start', 'POST', '{ "Name" : "'+name+'" }').then((res)=> {
          reply(res);
        });
      }
    },
    {
      path: '/api/logpeck/stop',
      method: 'POST',
      handler(req, reply) {
        var name=req.payload.Name;
        var ip=req.payload.ip;
        Http.post(ip, '/peck_task/stop', 'POST', '{ "Name" : "'+name+'" }').then((res)=> {
          reply(res);
        });
      }
    },
    {
      path: '/api/logpeck/remove',
      method: 'POST',
      handler(req, reply) {
        var name=req.payload.Name;
        var ip=req.payload.ip;
        Http.post(ip, '/peck_task/remove', 'POST', '{ "Name" : "'+name+'" }').then((res)=> {
          reply(res);
        });
      }
    },
    {
      path: '/api/logpeck/addTask',
      method: 'POST',
      handler(req, reply) {
        var name = req.payload.Name;
        var logpath = req.payload.Logpath;
        var Extractor = req.payload.Extractor;
        var Sender = req.payload.Sender;
        var Aggregator = req.payload.Aggregator;
        var Keywords = req.payload.Keywords;
        var ip = req.payload.ip;
        var esLog = {
          Name: name,
          LogPath: logpath,
          Extractor: Extractor,
          Sender: Sender,
          Aggregator: Aggregator,
          Keywords: Keywords
        };
        Http.post(ip, '/peck_task/add', 'POST', JSON.stringify(esLog)).then((res)=> {
          reply(res);
        });
      }
    },
    {
      path: '/api/logpeck/updateTask',
      method: 'POST',
      handler(req, reply) {
        var name = req.payload.Name;
        var logpath = req.payload.Logpath;
        var Extractor = req.payload.Extractor;
        var Sender = req.payload.Sender;
        var Aggregator = req.payload.Aggregator;
        var Keywords = req.payload.Keywords;
        var ip = req.payload.ip;
        var esLog = {
          Name: name,
          LogPath: logpath,
          Extractor: Extractor,
          Sender: Sender,
          Aggregator: Aggregator,
          Keywords: Keywords
        };
        Http.post(ip, '/peck_task/update', 'POST', JSON.stringify(esLog)).then((res)=> {
          reply(res);
        });
      }
    },

    {
      path: '/api/logpeck/key_up',
      method: 'POST',
      handler(req, reply) {
        var path=req.payload.LogPath;
        var ip=req.payload.ip;
        Http.post(ip, '/listpath?path='+path, 'POST', "").then((res)=> {
          reply(res);
        });
      }
    },

    {
      path: '/api/logpeck/testTask',
      method: 'POST',
      handler(req, reply) {
        var name = req.payload.Name;
        var logpath = req.payload.Logpath;
        var Extractor = req.payload.Extractor;
        var Sender = req.payload.Sender;
        var Aggregator = req.payload.Aggregator;
        var Keywords = req.payload.Keywords;
        var Test=req.payload.Test;
        var ip = req.payload.ip;
        var esLog = {
          Name: name,
          LogPath: logpath,
          Extractor: Extractor,
          Sender: Sender,
          Aggregator: Aggregator,
          Keywords: Keywords,
          Test:Test,
        };
        Http.post(ip, '/peck_task/test', 'POST', JSON.stringify(esLog)).then((res)=> {
          reply(res);
        });
      }
    },

  ]);

}