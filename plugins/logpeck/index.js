import { resolve } from 'path';
import initRoute from './server/routes/init';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'logpeck',
    uiExports: {

      app: {
        title: 'Logpeck',
        description: '管理监控',
        main: 'plugins/logpeck/app',
        url: '/app/logpeck#/',
      },

    },

    init(server, options) {
      // Add server routes and initialize the plugin here

      initRoute(server);
    }


  });
};
