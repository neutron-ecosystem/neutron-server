const chalk = require('chalk');
const path = require('path');
const { warning, green, blue, empty, log } = require('./utils/log');

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
const normalizeName = name => capitalizeFirstLetter(name).replace(/\-/g, ' ');

const relative = file => path.relative(process.cwd(), file);


const logPlatform = neutron => {
  const requestFunctions = neutron.getRequestedFunctions();
  const connections = neutron.getConnectionHosts();

  empty();
  blue('Should be connected to:')
  for (const connection of connections) {
    log(`- ${connection.host} via http or socket`)
  }

  empty();
  blue('Request remote functions:')
  for (const funcName of requestFunctions) {
    log(`- ${funcName}()`)
  }
};

const logMaster = neutron => {

};

const logApplicationSpec = (spec, meta, neutron) => {
  let suffix = ''
  if (neutron.isMaster()) {
    suffix = `started as master server at :${neutron.getPort()} port`;
  } else {
    suffix = `started as platform at :${neutron.getPort()} port`;
  }

  if (meta.isExists) {
    const normalizedName = normalizeName(spec.name);
    green(`${normalizedName} @ ${spec.version} ${suffix}`);
  } else {
    log(suffix);
    warning(`- applicaiton package.json does not exists. Expected at ${relative(meta.path)}`)
  }

  if (neutron.isMaster()) {
    logMaster(neutron);
  } else {
    logPlatform(neutron);
  }

  empty();
};

const logScope= (spec, meta) => {
  if (meta.isExists) {
    warning(`- Scope module does not exists. Expected at ${relative(meta.path)}`)
  }
};

const logSchemaWarnings = (schema) => {
  for (const message of schema.warnings) {
    warning(`- ${message}`);
  }
};


const logFunction = (funcName, schema) => {
  const neutronFunction = schema.functions.get(funcName);
  const higherOrder = neutronFunction.higherOrderMeta;

  let prefix = '';
  for (const higherOrderMeta of higherOrder) {
    prefix += `${blue(relative(higherOrderMeta.path))} -> `;
  }

  // NOTE: find other solution. getRemoteAddress is bad
  let suffix = '';
  if (neutronFunction.getRemoteAddress()) {
    suffix = ` at ${chalk.magenta(neutronFunction.getRemoteAddress())}`;
  }

  log(`- ${prefix}${funcName}()${suffix}`);
};

const logFunctions = (schema, meta) => {
  empty();
  let index = 1;
  const loggedFunctions = new Set();

  for (const [moduleName, mod] of schema.modules) {
    const moduleMeta = schema.meta.get(`module.${moduleName}`);
    const normalizedName = normalizeName(mod.name);

    green(`${index}. ${normalizedName} @ ${mod.version} at ${relative(moduleMeta.path)}`);

    for (const funcName of mod.functions) {
      logFunction(funcName, schema);
      loggedFunctions.add(funcName);
    }

    empty();
    index++;
  }

  // log functions that are without module
  blue(`Functions that are witout module:`);
  for (const funcName of schema.functions.keys()) {
    if (!loggedFunctions.has(funcName)) {
      logFunction(funcName, schema);
    }
  }
};

module.exports = (context, meta) => {
  logApplicationSpec(context.spec, meta.spec, context.neutron);

  logScope(context.scope, meta.scope);

  logSchemaWarnings(context.schema);

  logFunctions(context.schema, meta);
};
