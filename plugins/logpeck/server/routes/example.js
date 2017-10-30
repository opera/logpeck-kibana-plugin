import Wreck from 'wreck';

export default function (server) {
  server.route([
    {
      path: '/api/logpeck/init',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          console.log(ip);
          Wreck.post('http://localhost:9200/logpeck/host/_search?q=*&pretty',
            (err, xyResponse, payload) => {
              if (err) {
                console.log(err);
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
      path: '/api/logpeck/list',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          Wreck.post('http://'+ip+':7117/peck_task/list',
          (err, xyResponse, payload) => {
            if (err) {
              console.log(err);
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
      path: '/api/logpeck/start',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.name;
          Wreck.post('http://'+ip+':7117/peck_task/start',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                console.log(err);
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
      path: '/api/logpeck/stop',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.name;
          Wreck.post('http://'+ip+':7117/peck_task/stop',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                console.log(err);
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
      path: '/api/logpeck/remove',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.name;
          var ip=req.payload.ip;
          Wreck.post('http://'+ip+':7117/peck_task/remove',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                console.log(err);
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
      path: '/api/logpeck/addTask',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.name;
          var logpath=req.payload.logpath;
          var hosts=req.payload.hosts;
          var index=req.payload.index;
          var type=req.payload.type;
          console.log(req.payload);
          Wreck.post('http://localhost:7117/peck_task/add',{ payload: '{ "Name" : "'+name+'","LogPath":"'+logpath+'","ESConfig":{"Hosts":["'+hosts+'"],"Index":"'+index+'","Type":"'+type+'"} }' },
            (err, xyResponse, payload) => {
              if (err) {
                console.log(err);
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
      path: '/api/logpeck/addHost',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          Wreck.post('http://localhost:9200/logpeck/host',{ payload: '{ "ip" : "'+ip+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                console.log(err);
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
      path: '/api/logpeck/removeHost',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          //Wreck.delete('http://localhost:9200/logpeck/host/_query?',{payload:'{"query": { "match": {"ip":"'+ip+'"}}}'},
          Wreck.post('http://localhost:9200/logpeck/host/_search?_source=false',{payload:'{"query": { "match": {"ip":"'+ip+'"}}}'},
            (err, xyResponse, payload) => {
              if (err) {
                console.log(err);
              }
              reply(payload.toString());
              var getid=JSON.parse(payload.toString());
              var id=getid['hits']['hits'][0]['_id'];
              Wreck.delete('http://localhost:9200/logpeck/host/'+id+'?',(err, xyResponse, payload) => {});
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
