var Config = require('./config');
var File = require('./util/file');
var Http = require('./util/http');
export default function (server) {
  server.route([
    {
      path: '/api/logpeck/init',
      method: 'POST',
      handler(req, reply) {
        var hosts = File.read(Config.HostName);
        var hostPort =  new Array();
        if (hosts.data != "") {
          hostPort =hosts.data.split(",");
        }
        var result = [];
        var async_status = async function() {
          for (var i in hostPort) {
            var res = await Http.post(hostPort[i], '/version', 'POST', "");
            result[i] = {"data":{"host":hostPort[i],"version":res.data},"err":res.err}
          }
          return result;
        }
        async_status().then((ret)=> {
          reply(result);
        });
      }
    },
    {
      path: '/api/logpeck/listHost',
      method: 'POST',
      handler(req, reply) {
        var res = File.read(Config.HostName);
        var arr =  new Array();
        if (res.data != "") {
          arr =res.data.split(",");
        }
        res.data = arr;
        reply(res);
      }
    },
    {
      path: '/api/logpeck/addHost',
      method: 'POST',
      handler(req, reply) {
        var ip=req.payload.ip;
        reply(File.writeSet(Config.HostName, ip));
      }
    },
    {
      path: '/api/logpeck/removeHost',
      method: 'POST',
      handler(req, reply) {
        var ip=req.payload.ip;
        reply(File.removeSet(Config.HostName, ip));
      }
    },
    {
      path: '/api/logpeck/addGroup',
      method: 'POST',
      handler(req, reply) {
        var group=req.payload.Group;
        reply(File.writeSet(Config.GroupName, group));
      }
    },
    {
      path: '/api/logpeck/removeGroup',
      method: 'POST',
      handler(req, reply) {
        var group=req.payload.Group;
        var groupMemberPath = File.getPath(Config.GroupMemberPath, group);
        try {
          var fs = require('fs');
          if (fs.existsSync(groupMemberPath)) {
            fs.unlinkSync(groupMemberPath);
          }
        } catch(e) {
          reply({"data":"","err":e.toString()});
        }
        reply(File.removeSet(Config.GroupName, group));
      }
    },
    {
      path: '/api/logpeck/listGroup',
      method: 'POST',
      handler(req, reply) {
        var res = File.read(Config.GroupName);
        var arr =  new Array();
        if (res.data != "") {
          arr =res.data.split(",");
        }
        res.data = arr;
        reply(res);
      }
    },
    {
      path: '/api/logpeck/listGroupMember',
      method: 'POST',
      handler(req, reply) {
        var group = req.payload.Group;
        var groupMemberPath = File.getPath(Config.GroupMemberPath, group);
        var res = File.read(groupMemberPath);
        var arr =  new Array();
        if (res.data != "") {
          arr =res.data.split(",");
        }
        res.data = arr;
        reply(res);
      }
    },
    {
      path: '/api/logpeck/updateGroup',
      method: 'POST',
      handler(req, reply) {
        var group = req.payload.Group;
        var GroupMembers = req.payload.GroupMembers;
        var groupMemberPath = File.getPath(Config.GroupMemberPath, group);
        reply(File.write(groupMemberPath, GroupMembers));
      }
    },

    {
      path: '/api/logpeck/addTemplate',
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
        var templatePath = File.getPath(Config.TemplatePath, template_name);
        var res = File.write(templatePath, JSON.stringify(esLog));
        if (res.err) {
          reply(res);
        }
        reply(File.writeSet(Config.TemplateName, template_name));
      }
    },

    {
      path: '/api/logpeck/removeTemplate',
      method: 'POST',
      handler(req, reply) {
        var template_name=req.payload.template_name;
        var templatePath = File.getPath(Config.TemplatePath, template_name);
        try {
          var fs = require('fs');
          if (fs.existsSync(templatePath)) {
            fs.unlinkSync(templatePath);
          }
        } catch(e) {
          reply({"data":"","err":e.toString()});
        }
        reply(File.removeSet(Config.TemplateName, template_name));
      }
    },
    {
      path: '/api/logpeck/applyTemplate',
      method: 'POST',
      handler(req, reply) {
        var template_name=req.payload.template_name;
        var templatePath = File.getPath(Config.TemplatePath, template_name);
        var res = File.read(templatePath);
        res.data = JSON.parse(res.data);
        reply(res);
      }
    },
    {
      path: '/api/logpeck/list_template',
      method: 'POST',
      handler(req, reply) {
        var res = File.read(Config.TemplateName);
        var arr =  new Array();
        if (res.data != "") {
          arr =res.data.split(",");
        }
        res.data = arr;
        reply(res);
      }
    },
  ]);
}