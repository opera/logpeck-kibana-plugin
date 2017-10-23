export default function (server) {

  server.route({
    path: '/api/logpeck/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
