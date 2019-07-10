const path = require('path');
const defaultPkgJsonConfig = require('./defaultUserConfig/package.json');

module.exports = function generateConfig(mode, srcPath) {
  const pkgJsonConfig = Object.assign(
    defaultPkgJsonConfig,
    require(path.resolve(srcPath, 'package.json'))['@bnguyensn/bundler'] || {},
  );

  return {
    dirname: srcPath,
    mode,

    // package.json configs
    entryPath: pkgJsonConfig.entryPath,
    htmlWebpackPluginTemplatePath: pkgJsonConfig.htmlWebpackPluginTemplatePath,
    htmlWebpackPluginFaviconPath: pkgJsonConfig.htmlWebpackPluginFaviconPath,
    pwaManifestTemplate: pkgJsonConfig.pwaManifestTemplatePath
      ? require(path.resolve(srcPath, pkgJsonConfig.pwaManifestTemplatePath))
      : null,
    serviceWorkerFilePath: pkgJsonConfig.serviceWorkerFilePath,
    webpackDevServerPort: pkgJsonConfig.webpackDevServerPort,
    useTypeScript: pkgJsonConfig.useTypeScript,
  };
};
