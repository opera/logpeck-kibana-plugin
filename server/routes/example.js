export default function (server) {

  server.route({
    path: '/api/logpeck_kibana_plugin/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
