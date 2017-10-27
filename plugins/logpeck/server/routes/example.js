import Wreck from 'wreck';

export default function (server) {
  server.route([
    {
      path: '/api/logpeck/init',
      method: 'GET',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          Wreck.post('http://localhost:7117/peck_task/list',
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
          Wreck.post('http://localhost:7117/peck_task/list',
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
          //console.log(req.payload.name);
          var name=req.payload.name;
          Wreck.post('http://localhost:7117/peck_task/start',{ payload: '{ "Name" : "'+name+'" }' },
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
          Wreck.post('http://localhost:7117/peck_task/stop',{ payload: '{ "Name" : "'+name+'" }' },
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
          Wreck.post('http://localhost:7117/peck_task/remove',{ payload: '{ "Name" : "'+name+'" }' },
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
  ]);

}
