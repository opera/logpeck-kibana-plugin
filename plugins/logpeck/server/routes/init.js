import Wreck from 'wreck';

export default function (server) {
  server.route([
    {
      path: '/api/logpeck/init',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.post('http://'+local_ip+'/logpeck/host/_search?q=*&size=1000&pretty',
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              var b = JSON.parse(payload.toString());
              reply(payload.toString());
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/list',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          var  res;
          Wreck.post('http://'+ip+'/peck_task/list',
            (err, xyResponse, payload) => {
              var patt=new RegExp(/^List PeckTask failed,/);
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else if(payload==undefined){
                res='{"result":"undefined"}';
                reply(res);
              }
              else if(patt.test(res))
              {
                res='{"result":"'+payload.toString()+'"}';
                reply(res);
              }
              else{
                var list=JSON.parse(payload.toString());
                var task={"configs":[],"stats":[]};
                if(list["configs"]==null){
                  reply(task);
                }else {
                  var configs = {};
                  var stats={};
                  for(var id=0;id<list["configs"].length;id++){
                    configs[list["configs"][id]['Name']]=list["configs"][id];
                  }
                  for(var id=0;id<list["stats"].length;id++){
                    stats[list["stats"][id]['Name']]=list["stats"][id];
                  }
                  task={"configs":configs,"stats":stats};
                  reply(task);
                }
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/start',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.Name;
          var ip=req.payload.ip;
          var  res;
          Wreck.post('http://'+ip+'/peck_task/start',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                res = '{"result":"' + payload.toString() + '"}';
                reply(res);
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/stop',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.Name;
          var ip=req.payload.ip;
          var res;
          Wreck.post('http://'+ip+'/peck_task/stop',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                res = '{"result":"' + payload.toString() + '"}';
                reply(res);
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/remove',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.Name;
          var ip=req.payload.ip;
          console.log(name);
          Wreck.post('http://'+ip+'/peck_task/remove',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              var res;
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }else{
                res = '{"result":"'+payload.toString()+'"}';
                reply(res);
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/addTask',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        var res;
        const Add = async function () {
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
          Wreck.post('http://' + ip + '/peck_task/add', {payload: JSON.stringify(esLog)},
            (err, xyResponse, payload) => {
              if(err) {
                res = '{"result":"' + err.toString() + '"}';
                reply(res);
                return;
              }else{
                res = '{"result":"' + payload.toString() + '"}';
                reply(res);
              }
            });
        };
        try {
          Add();
        }
        catch (err) {
          console.log('err');
        }
      }
    },
    {
      path: '/api/logpeck/addHost',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.get('http://'+local_ip+'/logpeck/host/'+ip,
            (err, xyResponse, payload) => {
              var exist=JSON.parse(payload.toString());
              var res;
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else if(exist['found']==false) {
                Wreck.put('http://'+local_ip+'/logpeck/host/'+ip,{payload: '{ "exist" : "false"}'},
                  (err, xyResponse, payload) => {
                    if (err) {
                      res = '{"result":"'+err.toString()+'"}';
                      reply(res);
                    }
                    else {
                      res = '{"result":"Add success"}';
                      reply(res);
                    }
                  });
              }
              else{
                res = '{"result":"Already exist"}';
                reply(res);
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/removeHost',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.delete('http://'+local_ip+'/logpeck/host/' + ip + '?',
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                res = '{"result":"' + ip + '"}';
                reply(res);
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/addGroup',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var Group=req.payload.Group;
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.get('http://'+local_ip+'/logpeck_group/name/'+Group+'?',
            (err, xyResponse, payload) => {
              var result=JSON.parse(payload.toString());
              console.log(result);
              var res;
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else if(result['found']==false) {
                var a={ip:[]};
                Wreck.put('http://'+local_ip+'/logpeck_group/name/'+Group+'?',{payload: JSON.stringify(a)},
                  (err, xyResponse, payload) => {
                    if (err) {
                      res = '{"result":"'+err.toString()+'"}';
                      reply(res);
                    }
                    else {
                      //console.log(payload.toString());
                      res = '{"result":"Add group success"}';
                      reply(res);
                    }
                  });
              }
              else{
                res = '{"result":"Group already exist"}';
                reply(res);
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/removeGroup',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var Group=req.payload.Group;
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.delete('http://'+local_ip+'/logpeck_group/name/' + Group + '?',
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                res = '{"result":"Remove group success"}';
                reply(res);
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/updateGroup',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var Group=req.payload.Group;
          var GroupMembers=req.payload.GroupMembers;
          var res;
          var a={ip:GroupMembers};
          var local_ip=req.payload.local_ip;
          Wreck.put('http://'+local_ip+'/logpeck_group/name/'+Group+'?',{payload: JSON.stringify(a)},
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                //console.log(payload.toString());
                res = '{"result":"update group success"}';
                reply(res);
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/searchGroup',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.get('http://'+local_ip+'/logpeck_group/name/_search?q=*&size=1000&pretty',
            (err, xyResponse, payload) => {
              var result=JSON.parse(payload.toString());
              var res;
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              } else{
                var group={};
                for(var i=0;i<result['hits']['total'];i++){
                  group[result['hits']['hits'][i]['_id']]=result['hits']['hits'][i]['_source']['ip']
                }
                reply(group);
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/updateTask',
      method: 'POST',
      handler(req, reply) {
        var array=JSON.stringify(req.payload.Fields);
        const Wreck = require('wreck');
        var res;
        const Update = async function () {
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
          Wreck.post('http://' + ip + '/peck_task/update', {payload: JSON.stringify(esLog)},
            (err, xyResponse, payload) => {
              if(err) {
                console.log(err)
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
                return;
              }else if(payload.toString()=="Update Success") {
                res = '{"result":"Update Success"}';
                reply(res);
              }else{
                res = '{"result":"'+payload.toString()+'"}';
                reply(res);
              }
            });
        };

        try {
          Update();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/addTemplate',
      method: 'POST',
      handler(req, reply) {
        var array=JSON.stringify(req.payload.Fields);
        const Wreck = require('wreck');
        const  addTemplate= async function () {
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
          var local_ip=req.payload.local_ip;
          Wreck.post('http://'+local_ip+'/.logpeck/template/'+template_name, {payload: JSON.stringify(esLog)},
            (err, xyResponse, payload) => {
              var res;
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                if( xyResponse.statusMessage=='OK'|| xyResponse.statusMessage=='Created' ){
                  res = '{"result":"Add success"}';
                  reply(res);
                }
                else{
                  res = '{"result":"'+payload.toString()+'"}';
                  reply(res);
                }
              }
            });
        };

        try {
          addTemplate();
        }
        catch (err) {
        }
      }
    },

    {
      path: '/api/logpeck/removeTemplate',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var template_name=req.payload.template_name;
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.delete('http://'+local_ip+'/.logpeck/template/' + template_name + '?',
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                res = '{"result":"' + template_name + '"}';
                reply(res);
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },

    {
      path: '/api/logpeck/applyTemplate',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var template_name=req.payload.template_name;
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.get('http://'+local_ip+'/.logpeck/template/' + template_name ,
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                reply(payload.toString());
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },

    {
      path: '/api/logpeck/list_template',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var res;
          var local_ip=req.payload.local_ip;
          Wreck.post('http://'+local_ip+'/.logpeck/template/_search?q=*&size=1000&pretty',
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              reply(payload.toString());
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },

    {
      path: '/api/logpeck/key_up',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        var path=req.payload.LogPath;
        var ip=req.payload.ip;
        const example = async function () {
          var res;
          Wreck.post('http://'+ip+'/listpath?path='+path,
            (err, xyResponse, payload) => {
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              reply(payload.toString());
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },

    {
      path: '/api/logpeck/testTask',
      method: 'POST',
      handler(req, reply) {
        var array=JSON.stringify(req.payload.Fields);
        const Wreck = require('wreck');
        var res;
        const example = async function () {
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
          Wreck.post('http://'+ip+'/peck_task/test', {payload: JSON.stringify(esLog)},
            (err, xyResponse, payload) => {
              console.log(xyResponse.statusCode);
              if (err) {
                res = '{"result":"'+err.toString()+'"}';
                reply(res);
              }
              else {
                if(xyResponse.statusMessage=='OK'){
                  var res=payload.toString();
                  reply(res);
                }
                else{
                  res = '{"result":"'+payload.toString()+'"}';
                  reply(res);
                }
              }
            });
        };
        try {
          example();
        }
        catch (err) {
          console.log(err);
        }
      }
    },

    {
      path: '/api/logpeck/refresh',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        function list(ip,status) {
          var local_ip=req.payload.local_ip;
          var i=0;
          Wreck.post('http://' + ip + '/version',
            (err, xyResponse, payload) => {
              var version = '';
              var now;
              var code;
              if (err) {
                code = err.output.statusCode;
                now = "false";
                version = 'error';
              }
              else {
                code = xyResponse.statusCode;
                now = "true";
                if (code == 200) {
                  version = payload.toString();
                }
              }
              Wreck.put('http://'+local_ip+'/logpeck/host/' + ip, {payload: '{ "exist" : "' + now + '","version" : "' + version + '"}'},
                (err, xyResponse, payload) => {
                  if (err) {

                  }
                });
              i = i + 1;
            });
          return i;
        }
        const example = function () {
          var local_ip=req.payload.local_ip;
          Wreck.post('http://'+local_ip+'/logpeck/host/_search?q=*&size=1000&pretty',
            (err, xyResponse, payload) => {
              var ip;
              var status;
              var version = '';
              var now;
              var code;
              if (err) {
                code = err.output.statusCode;
                reply("refresh err:"+code);
              }
              var b = JSON.parse(payload.toString());
              for (var id = 0; id < b['hits']['total']; id++) {
                ip=b['hits']['hits'][id]['_id'];
                status = b['hits']['hits'][id]['_source']['exist'];
                list(ip,status);
              }
              reply("refresh success");
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },

    {
      path: '/api/logpeck/version',
      method: 'POST',
      handler(req, reply) {
        var ip=req.payload.ip;
        var status="false";
        const Wreck = require('wreck');
        const example = function () {
          var local_ip=req.payload.local_ip;
          Wreck.post('http://' + ip + '/version',
            (err, xyResponse, payload) => {
              var version = '';
              var now;
              var code;
              if (err) {
                code = err.output.statusCode;
                now = "false";
                version = 'error';
              }
              else {
                code = xyResponse.statusCode;
                now = "true";
                if (code == 200) {
                  version = payload.toString();
                }
              }
              Wreck.put('http://'+local_ip+'/logpeck/host/' + ip, {payload: '{ "exist" : "' + now + '","version" : "' + version + '"}'},
                (err, xyResponse, payload) => {
                  if (err) {

                  }
                });
              reply(version);
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },

  ]);

}
