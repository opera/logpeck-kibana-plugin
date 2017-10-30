import { resolve } from 'path';
import exampleRoute from './server/routes/example';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'logpeck',
    uiExports: {

      app: {
        title: 'Logpeck',
        description: '管理监控',
        main: 'plugins/logpeck/app'
      },


      translations: [
        resolve(__dirname, './translations/es.json')
      ],


      hacks: [
        'plugins/logpeck/hack'
      ]

    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },


    init(server, options) {
      // Add server routes and initialize the plugin here

      exampleRoute(server);
    }


  });
};
