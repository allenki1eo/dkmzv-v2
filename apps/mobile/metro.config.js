const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.extraNodeModules = {
  '@ebenezer/tokens': path.resolve(workspaceRoot, 'packages/tokens'),
  '@ebenezer/shared': path.resolve(workspaceRoot, 'packages/shared'),
};

const withWind = withNativeWind(config, { input: './global.css' });
const previousResolve = withWind.resolver.resolveRequest;
withWind.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'query-string') {
    return {
      filePath: path.resolve(projectRoot, 'shims/query-string.js'),
      type: 'sourceFile',
    };
  }
  if (previousResolve) return previousResolve(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withWind;
