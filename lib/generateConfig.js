const path = require('path');
const defaultPkgJsonConfig = require('./default-user-config/package.json');

module.exports = function generateConfig(webpackMode, srcPath) {
  const pkgJsonConfig = Object.assign(
    defaultPkgJsonConfig,
    require(path.resolve(srcPath, 'package.json'))['@bnguyensn/bundler'] || {},
  );

  return {
    dirname: srcPath,
    mode: webpackMode,

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
