const http = require('http');
const koa = require('koa');
const cors = require('koa-cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const loadMeta = require('neutron-meta');
const { loadContext } = require('neutron-context');

const { serverListeners, clientListeners, connectToServer } = require('neutron-connection');
const dashboardServer= require('neutron-dashboard');

const logContext = require('./log-context');
const validateContext = require('./validate-context');
//
// const log = context => {
//   const { schema } = context;
//
//   for (const funcName of schema.functions.keys()) {
//     const neutronFunc= schema.functions.get(funcName);
//     const meta = schema.meta.get(`function.${funcName}`);
//
//     console.log(`- ${funcName} (${neutronFunc.higherOrder.length}) ${meta.url || meta.path}`);
//   }
//
//   console.log('');
// };

module.exports = options => {
  return loadMeta(options).then(meta => {
    return loadContext(options, meta).then(context => {

      validateContext(context, meta);

      const app = koa();
      app.use(cors());
      app.use(bodyParser());
      app.use(logger());

      const server = http.createServer(app.callback());

      if (context.neutron.isMaster()) {
        /**
         * Connection from clinet.
         * - platform and lambda function calls
         * - client code initialization
         * Enable platform registration by neutron-ping
         * neutron-ping - http require to neutron-server to registar plartform
         * at server context.
         */
        serverListeners(app, context);
        clientListeners(app, context);

        /**
         * Enable web dashboard.
         * - show server config
         * - show all plartforms and their contexts
         * - all lambda functions
         * - other real time information
         */
        if (options.enableDashboard) {
          // dashboardServer(app, context);
        }

      } else {;
        connectToServer(context);
      }

      logContext(context, meta);

      server.listen(context.neutron.getPort());
    });
  }).catch(e => {
    console.error(e);
  })
};
