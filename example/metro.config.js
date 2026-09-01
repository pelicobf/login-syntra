const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// La dependencia file: apunta al paquete padre, que también tiene dependencias
// de desarrollo. Resolvemos todo desde la demo para evitar dos copias de React.
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

module.exports = config;
