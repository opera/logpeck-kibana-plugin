var Config = require('../../logpeckConfig').Config;
var File = require('./util/file');
var Http = require('./util/http');
export default function (server) {
  server.route([
    {
      path: '/api/logpeck/init',
      method: 'POST',
      handler(req, reply) {
        var hosts = File.readAllKey(Config.HostName);
        var async_status = async function() {
          var result = [];
          for (var i in hosts.data) {
            var res = await Http.post(hosts.data[i], '/version', 'POST', "");
            result[i] = {"host":hosts.data[i], "version":res.data, "err":res.err}
          }
          return {"data":result, "err":null}
        }
        async_status().then((ret)=> {
          reply(ret);
        });
      }
    },
    {
      path: '/api/logpeck/listHost',
      method: 'POST',
      handler(req, reply) {
        reply(File.readAllKey(Config.HostName));
      }
    },
    {
      path: '/api/logpeck/addHost',
      method: 'POST',
      handler(req, reply) {
        var ip=req.payload.ip;
        var res = File.writeSet(Config.HostName, ip, {});
        reply(File.keyToList(res));
      }
    },
    {
      path: '/api/logpeck/removeHost',
      method: 'POST',
      handler(req, reply) {
        var ip=req.payload.ip;
        var res = File.removeSet(Config.HostName, ip);
        reply(File.keyToList(res));
      }
    },
    {
      path: '/api/logpeck/addGroup',
      method: 'POST',
      handler(req, reply) {
        var group = req.payload.Group;
        var res = File.writeSet(Config.GroupName, group, []);
        reply(File.keyToList(res));
      }
    },
    {
      path: '/api/logpeck/removeGroup',
      method: 'POST',
      handler(req, reply) {
        var group = req.payload.Group;
        var res = File.removeSet(Config.GroupName, group);
        reply(File.keyToList(res));
      }
    },
    {
      path: '/api/logpeck/listGroup',
      method: 'POST',
      handler(req, reply) {
        reply(File.readAllKey(Config.GroupName));
      }
    },
    {
      path: '/api/logpeck/listGroupMember',
      method: 'POST',
      handler(req, reply) {
        var group = req.payload.Group;
        var res = File.readSet(Config.GroupName, group);
        reply(res);
      }
    },
    {
      path: '/api/logpeck/updateGroup',
      method: 'POST',
      handler(req, reply) {
        var group = req.payload.Group;
        var GroupMembers = req.payload.GroupMembers;
        var res = File.resetValue(Config.GroupName, group, GroupMembers);
        reply(File.keyToList(res));
      }
    },

    {
      path: '/api/logpeck/addTemplate',
      method: 'POST',
      handler(req, reply) {
        var template_name = req.payload.template_name;
        var reset = req.payload.reset;
        var name = req.payload.Name;
        var logpath = req.payload.Logpath;
        var Extractor = req.payload.Extractor;
        var Sender = req.payload.Sender;
        var Aggregator = req.payload.Aggregator;
        var Keywords = req.payload.Keywords;
        var esLog = {
          Name: name,
          LogPath: logpath,
          Extractor: Extractor,
          Sender: Sender,
          Aggregator: Aggregator,
          Keywords: Keywords
        };
        var res;
        if (reset) {
          res = File.resetValue(Config.TemplateName, template_name, esLog);
        } else {
          res = File.writeSet(Config.TemplateName, template_name, esLog);
        }
        reply(File.keyToList(res));
      }
    },

    {
      path: '/api/logpeck/updateTemplate',
      method: 'POST',
      handler(req, reply) {
        var template_name=req.payload.template_name;
        var name = req.payload.Name;
        var logpath = req.payload.Logpath;
        var Extractor = req.payload.Extractor;
        var Sender = req.payload.Sender;
        var Aggregator = req.payload.Aggregator;
        var Keywords = req.payload.Keywords;
        var esLog = {
          Name: name,
          LogPath: logpath,
          Extractor: Extractor,
          Sender: Sender,
          Aggregator: Aggregator,
          Keywords: Keywords
        };
        var res = File.resetValue(Config.TemplateName, template_name, esLog);
        reply(File.keyToList(res));
      }
    },

    {
      path: '/api/logpeck/removeTemplate',
      method: 'POST',
      handler(req, reply) {
        var template_name=req.payload.template_name;
        var res = File.removeSet(Config.TemplateName, template_name);
        reply(File.keyToList(res));
      }
    },
    {
      path: '/api/logpeck/applyTemplate',
      method: 'POST',
      handler(req, reply) {
        var template_name=req.payload.template_name;
        var res = File.readSet(Config.TemplateName, template_name);
        reply(res);
      }
    },
    {
      path: '/api/logpeck/list_template',
      method: 'POST',
      handler(req, reply) {
        var res = File.readAllKey(Config.TemplateName);
        reply(res);
      }
    },
  ]);
}