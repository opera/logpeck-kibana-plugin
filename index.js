import local from './server/routes/local-request';
import remote from './server/routes/remote-request';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'logpeck-kibana-plugin',
    uiExports: {
      app: {
        title: 'Logpeck',
        description: 'This plugin is used to control Logpeck',
        main: 'plugins/logpeck-kibana-plugin/app',
      },
      hacks: [
        'plugins/logpeck-kibana-plugin/hack'
      ],
      styleSheetPaths: require('path').resolve(__dirname, 'public/app.scss'),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars
      // Add server routes and initialize the plugin here
      local(server);
      remote(server);
    }
  });
}
