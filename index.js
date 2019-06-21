/**
 * This file exports a function that that returns a webpack config object. The
 * function takes 1 parameter: an object containing variables only known at
 * run time (e.g. user's top-level directory path).
 * */

// ********** IMPORTS ********** //

// Core packages
const path = require('path');
const webpack = require('webpack');

// Babel
const babelOptions = require('./package')['babel'];

// Plugins
const ManifestPlugin = require('webpack-manifest-plugin');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');
const postcssPresetEnv = require('postcss-preset-env');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPWAManifest = require('webpack-pwa-manifest');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// workbox-webpack-plugin is temporarily disabled until Workbox 5
// https://github.com/GoogleChrome/workbox/issues/1513
// const { InjectManifest } = require('workbox-webpack-plugin');
const SWPlugin = require('./lib/SWPlugin/SWPlugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

// ********** GLOBALS ********** //

const globals = {
  outputPathBaseJS: 'static/js/',
  outputPathBaseStyles: 'static/css/',
  outputPathBaseMedia: 'static/media/', // For images, fonts, and others
  urlLoaderSizeLimit: 1024 * 10, // 10kb
};

// ********** HELPERS ********** //

/**
 * Return loaders for .css files. We do this because we have slightly different
 * loaders for pure .css files and CSS modules files.
 * @param {boolean} devMode - Is this a development build?
 * @param {boolean} cssModules - Are the loaders used for CSS modules files?
 * @returns {Object}[] - An array of loaders for CSS files.
 * */
function getCSSLoaders(devMode, cssModules) {
  return [
    // *** 1st loader ***
    // For development, we use style-loader. This loader takes CSS code
    // and inserts it into the HTML page via a <style> tag. This tag is
    // appended by default to <head>.
    // https://github.com/webpack-contrib/style-loader
    // For production, we use mini-css-extract-plugin. This loader
    // extracts CSS into separate files, which helps with code
    // splitting. There also is a plugin bit that comes with this
    // that we have to define under the plugin section.
    // https://github.com/webpack-contrib/mini-css-extract-plugin
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,

    // *** 2nd loader ***
    // css-loader interprets @import and url() like statements and
    // resolve them.
    // Both development and production use the same 2nd loader.
    // https://github.com/webpack-contrib/css-loader
    {
      loader: 'css-loader',
      options: {
        // How many other loaders are applied before css-loader (i.e.
        // the loaders declared below css-loader)?
        importLoaders: 1, // There is only postcss-loader

        // We turn this flag on when loading CSS modules files.
        // https://webpack.js.org/loaders/postcss-loader/#css-modules
        modules: cssModules
          ? {
              // Using 'local' requires you to specify :global for global classes.
              // Using 'global' requires you to specify :local for local classes.
              // https://github.com/css-modules/css-modules#exceptions
              mode: 'local',

              // Rules for generating the CSS modules file names. This is quite
              // primitive (create-react-app demonstrates a much more sophisticated
              // rule set via getLocalIdent. We're keeping things simple for now.
              // https://github.com/webpack-contrib/css-loader#localidentname
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            }
          : false,
      },
    },

    // *** 3rd loader ***
    // postcss-loader is added on top to handle various CSS utilities
    // e.g. cross-browser prefixes, normalize.css, etc.
    // Both development and production use the same 3rd loader.
    // https://github.com/postcss/postcss-loader
    {
      loader: 'postcss-loader',
      options: {
        // This is necessary for external CSS imports to work.
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',

        plugins: () => [
          // postcss-flexbugs-fixes tries to fix Flexbox issues.
          postcssFlexbugsFixes(),

          // postcss-preset-env polyfills CSS files based on our browserslist
          // settings. It also includes autoprefixer.
          // https://github.com/csstools/postcss-preset-env
          // The options passed follow create-react-app.
          postcssPresetEnv({
            autoprefixer: { flexbox: 'no-2009' },
            stage: 3,
          }),

          // postcss-normalize lets you use the parts of normalize.css
          // you need from the browserlist field. Use this by adding an
          // @import-normalize; line at the top of your CSS file.
          postcssNormalize(),
        ],
      },
    },
  ];
}

// ********** WEBPACK CONFIG ********** //

/**
 * Return a webpack config object
 * @param {Object} runtimeConfig: an object containing variables only known at
 * runtime
 * @returns {Object}: a webpack config object
 * */
module.exports = runtimeConfig => {
  const devMode = runtimeConfig.mode === 'development';

  return {
    // ========================== //
    // ========== Mode ========== //
    // ========================== //
    mode: devMode ? 'development' : 'production',

    // =========================== //
    // ========== Entry ========== //
    // =========================== //
    // We are building a Single-Page Application, thus only one entry is needed.
    // More entries can be specified for Multi-Page Applications, but this is
    // not supported for now.
    entry: {
      index: path.join(runtimeConfig.dirname, runtimeConfig.entryPath),
    },

    // ============================ //
    // ========== Output ========== //
    // ============================ //
    // Our build process puts all assets (.js, .css, etc.) in a "static" folder.
    // The top-level "dist" folder only contains the index.html file. This
    // index.html file is the one served by our server (e.g. Express) client
    // browsers. This "static" folder helps with organising files.
    // The path of the index.html file is controlled by HtmlWebpackPlugin,
    // further down in this config.
    output: {
      path: path.join(runtimeConfig.dirname, 'dist'),

      // This public URL is prefixed to every URL created by webpack. It is
      // the URL of our output.path from the view of the HTML page.
      // Note: include the prefix '/' for server-relative URLs.
      publicPath: '/',

      // [contenthash]: change based on the asset's content
      // Howev er, contenthash will not stay the same between builds even if the
      // asset's content hasn't changed. To make contenthash deterministic, we
      // need to extract out webpack's runtime and manifest (together
      // "boilerplate"). This can be achieved via the SplitChunksPlugin.
      filename: devMode
        ? `${globals.outputPathBaseJS}[name].js`
        : `${globals.outputPathBaseJS}[name].[contenthash].js`,

      // Placeholders like [name] or [chunkhash] require a mapping from chunk
      // id to placeholders to output files, increasing the final bundle size.
      // Thus we switch from [name] to [id] in production.
      chunkFilename: devMode
        ? `${globals.outputPathBaseJS}[name].chunk.js`
        : `${globals.outputPathBaseJS}[name].[contenthash].chunk.js`,

      // *** Build Performance ***
      // path info in the output bundle can put garbage collection pressure on
      // projects that bundle thousands of modules. This is default to true
      // and should be turned off in development mode.
      // https://webpack.js.org/guides/build-performance#output-without-path-info
      pathinfo: devMode,
    },

    // ======================================= //
    // ========== Module Resolution ========== //
    // ======================================= //
    // This determines how webpack looks for files.
    // https://webpack.js.org/configuration/resolve/
    resolve: {
      // webpack will resolve extensions in order from left to right when there
      // are files with the same name. Mainly used for TypeScript integration.
      extensions: ['.tsx', '.ts', '.js'],
    },

    // ============================= //
    // ========== Loaders ========== //
    // ============================= //
    module: {
      rules: [
        // *** JavaScript ***
        // babel-loader allows transpiling JavaScript using Babel and webpack.
        {
          test: /\.(js|jsx)$/,
          use: { loader: 'babel-loader', options: babelOptions },
          exclude: /node_modules/,
        },

        // *** TypeScript ***
        // ts-loader is used to load TypeScript files, but only after
        // babel-loader
        // https://webpack.js.org/guides/typescript/
        // https://github.com/microsoft/TypeScriptSamples/blob/master/react-flux-babel-karma/webpack.config.js
        runtimeConfig.useTypeScript
          ? {
              test: /\.tsx?$/,
              use: [
                { loader: 'babel-loader', options: babelOptions },
                {
                  loader: 'ts-loader',
                  options: {
                    // This option is for fork-ts-checker-webpack-plugin. It is
                    // also needed for webpack-dev-server HMR.
                    // https://github.com/Realytics/fork-ts-checker-webpack-plugin#installation
                    // https://github.com/TypeStrong/ts-loader#hot-module-replacement
                    transpileOnly: true,
                  },
                },
              ],
              exclude: /node_modules/,
            }
          : false,

        // *** CSS ***
        // We use a function to determine loaders for CSS files because we
        // separate out how "normal" CSS files and CSS modules files are loaded.
        {
          test: /\.css$/,
          use: getCSSLoaders(devMode, false),

          // We also exclude our CSS modules regex here else our CSS loaders
          // will override our CSS modules loaders.
          exclude: [/node_modules/, /\.module\.css$/],
        },
        {
          test: /\.module\.css$/,
          use: getCSSLoaders(devMode, true),
          exclude: /node_modules/,
        },

        // *** Images ***
        // url-loader is used to load images for both development and
        // production. It automatically fallback to file-loader for file sizes
        // above the specified limit.
        {
          test: /\.(png|jpe?g|gif|bmp)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: globals.urlLoaderSizeLimit,
              name: devMode
                ? `${globals.outputPathBaseMedia}[name].[ext]`
                : `${globals.outputPathBaseMedia}[name].[contenthash].[ext]`,
            },
          },
          exclude: /node_modules/,
        },

        // *** SVGs ***
        // To import and use SVGs:
        // import svgURL, {ReactComponent as SVGComponent} from './file.svg';
        // ...then either of the below:
        // <img src={svgURL} />
        // <SVGComponent />
        // Note that to make SVG imports work in TypeScript, a declaration file
        // for SVGs need to be created.
        {
          test: /\.(svg)$/,
          issuer: {
            test: /\.(jsx?|tsx?)$/,
          },
          use: [
            // @svgr/webpack converts SVGs to React components and is the
            // preferred method to load SVGs.
            // https://www.smooth-code.com/open-source/svgr/docs/webpack/
            '@svgr/webpack',
          ],
          exclude: /node_modules/,
        },
        // We need to handle conversion of SVGs into data URLs as well.
        // svg-url-loader is well-suited for this task.
        {
          test: /\.(svg)$/,
          use: {
            loader: 'svg-url-loader',
            options: {
              noquotes: true,
              limit: globals.urlLoaderSizeLimit,
            },
          },
          exclude: /node_modules/,
        },

        // *** Images compression ***
        // Both development and production use image-webpack-loader for image
        // compression. It must work in pair with file-loader (which is used as
        // a fallback for images above the size limit).
        // A separate loader entry is used for image-webpack-loader because we
        // are combining both normal image file types and SVGs here.
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: {
            loader: 'image-webpack-loader',
            options: {
              // By default, image-webpack-loader optimises JPEGs, PNGs, SVGs,
              // and GIFs. Here we additionally optimises WEBPs.
              webp: {
                enabled: true,
              },
            },
          },
          exclude: /node_modules/,

          // image-webpack-loader must be chained AFTER file-loader. This means
          // it is applied before file-loader.
          // https://github.com/tcoopman/image-webpack-loader#usage
          // The option enforce: 'pre' accomplishes this. It forces
          // image-webpack-loader to be applied before all 'normal' loaders
          // (i.e. other image loaders: file-loader, etc.).
          // https://webpack.js.org/configuration/module/#ruleenforce
          enforce: 'pre',
        },

        // *** Fonts ***
        // Both development and production use file-loader for fonts.
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: { outputPath: `${globals.outputPathBaseMedia}` },
            },
          ],
        },

        // *** Texts ***
        // Both development and production use raw-loader for raw text files.
        {
          test: /\.txt$/,
          use: 'raw-loader',
          exclude: /node_modules/,
        },
      ].filter(Boolean),
    },

    // ============================= //
    // ========== Plugins ========== //
    // ============================= //
    plugins: [
      // *** Mode ***
      // DefinePlugin is used to create global constants for usage in our actual
      // application.
      // https://webpack.js.org/plugins/define-plugin/
      new webpack.DefinePlugin({
        DEFINEPLUGIN_DEVMODE: devMode,
        DEFINEPLUGIN_SERVICEWORKER: !!runtimeConfig.serviceWorkerFilePath,
      }),

      // *** HTML Creation ***
      // html-webpack-plugin is the de facto plugin for creating HTML files.
      // https://github.com/jantimon/html-webpack-plugin#options
      new HtmlWebpackPlugin({
        template: path.resolve(
          runtimeConfig.dirname,
          runtimeConfig.htmlWebpackPluginTemplatePath,
        ),

        favicon: runtimeConfig.htmlWebpackPluginFaviconPath
          ? path.join(
              runtimeConfig.dirname,
              runtimeConfig.htmlWebpackPluginFaviconPath,
            )
          : false,

        filename: 'index.html',
      }),

      // *** PWA manifest ***
      // webpack-pwa-manifest is used to generate the manifest.json file.
      // Option values are taken from a JSON or JavaScript file as defined
      // in the user's package.json file. If no such file is found, this
      // plugin will not be used.
      // Note that this plugin should be defined AFTER
      // html-webpack-plugin.
      // https://github.com/arthurbergmz/webpack-pwa-manifest
      runtimeConfig.pwaManifestTemplate
        ? new WebpackPWAManifest(runtimeConfig.pwaManifestTemplate)
        : () => {},

      // This plugin runs the type checker on a separate process, allowing our
      // build to remain fast while retaining type checking.
      runtimeConfig.useTypeScript
        ? new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve(runtimeConfig.dirname, 'tsconfig.json'),
            measureCompilationTime: true,
            useTypescriptIncrementalApi: true,

            // Watch the 'src' folder. This option is not required but improves
            // performance.
            watch: path.resolve(
              runtimeConfig.dirname,
              runtimeConfig.entryPath,
              '..',
            ),

            // If the overlay functionality of webpack-dev-server is used, this
            // should be set to false.
            async: !devMode,
          })
        : () => {},

      ...(devMode
        ? [
            // ======================================================= //
            // THE BELOW PLUGINS ARE SPECIFIC TO DEVELOPMENT RUNS ONLY //
            // ======================================================= //

            // *** Hot Module Replacement (development) ***
            // This is what allows us to see the effects of our changed files
            // immediately on the web browser during development.
            new webpack.HotModuleReplacementPlugin(),
          ]
        : [
            // ====================================================== //
            // THE BELOW PLUGINS ARE SPECIFIC TO PRODUCTION RUNS ONLY //
            // ====================================================== //

            // *** CSS Optimization (production) ***
            // mini-css-extract-plugin extracts CSS into separate files.
            // There is also a loader component.
            // https://github.com/webpack-contrib/mini-css-extract-plugin
            new MiniCssExtractPlugin({
              // Options are similar to webpackOptions.output
              filename: 'static/styles/[name].[contenthash].css',
              chunkFilename: 'static/styles/[id].[contenthash].chunk.css',
            }),

            // *** PWA - Offline Support (production) ***
            // https://webpack.js.org/guides/progressive-web-application#adding-workbox
            // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_1
            // Currently not in use until this issue is fixed in Workbox 5:
            // https://github.com/GoogleChrome/workbox/issues/1513
            /*new InjectManifest({
              // Path to the service worker JavaScript file
              swSrc: path.resolve(
                runtimeConfig.dirname,
                'src/service-worker.js',
              ),

              // Path to the service worker and precache manifest JavaScript
              // files that will be built. Note that we want to put this file in
              // the same place as our index.html file.
              swDest: '../service-worker.js',
              importsDirectory: '../',

              // Since we already configured webpack to cache bust based on
              // [contenthash], we can tell Workbox to ignore its normal HTTP
              // cache-busting procedure that's done when populating the
              // precache.
              dontCacheBustURLsMatching: /\.\w{20}\./,
            }),*/
            runtimeConfig.serviceWorkerFilePath
              ? new SWPlugin({
                  serviceWorkerInputFilePath: path.resolve(
                    runtimeConfig.dirname,
                    runtimeConfig.serviceWorkerFilePath,
                  ),
                })
              : () => {}, // Note: 'null' or 'undefined' is not allowed

            // *** Caching (production) ***
            // Output chunks' hashes could change due to
            // changes in module.id and our caches will be busted
            // unintentionally.
            // The HashedModuleIdsPlugin causes hashes to be based on the
            // relative paths of modules and prevent this issue.
            // For development builds, we use NamedModulesPlugin instead. This
            // is enabled in mode: 'development' by default.
            new webpack.HashedModuleIdsPlugin(),

            // *** Output Analytics (production) ***
            // Visualise webpack output file sizes with an interactive zoomable
            // treemap.
            // https://github.com/webpack-contrib/webpack-bundle-analyzer
            new BundleAnalyzerPlugin({
              // Don't open report in default browser automatically
              openAnalyzer: false,
            }),
          ]),

      // *** Webpack Manifest ***
      // webpack's manifest is a file that tracks how all modules map to output
      // bundles. Note that this is NOT related to the PWA manifest.json file,
      // which is a file that tells client applications basic information about
      // our web application.
      // https://webpack.js.org/guides/output-management/#the-manifest
      new ManifestPlugin({
        fileName: 'webpackManifest.json',
      }),
    ],

    // ============================= //
    // ========== Devtool ========== //
    // ============================= //
    devtool: devMode ? 'cheap-module-eval-source-map' : 'source-map',

    // ======================================================= //
    // ========== DevServer (development mode only) ========== //
    // ======================================================= //
    devServer: {
      // *** Info ***
      // webpack-dev-server doesn't write any files after compiling but keeps
      // them in memory and serves them as if they exist at the server's root
      // path. We have our server's root path as '/' (see output.publicPath).

      // This determines where files should be served from and takes precedence
      // over devServer.contentBase. A single forward slash means files will be
      // served like so: "http://localhost:xxxx/index.html", which is what we
      // want most of the time.
      // Note: this should always start and end with a forward slash. It also
      // should be the same as output.publicPath
      publicPath: '/',

      // This option is needed for client-side routers:
      // https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
      historyApiFallback: true,

      // Without this, there might be CORS issues:
      // https://github.com/webpack/webpack-dev-server/issues/533
      disableHostCheck: true,

      // Enable gzip compression
      compress: true,

      port: runtimeConfig.webpackDevServerPort,

      // Show a full-screen overlay in the browser when there are compiler
      // errors.
      overlay: {
        errors: true,
        warnings: true,
      },

      // Options for serving static files. Follow expressJS rules.
      staticOptions: {
        // This is needed to serve html files with names other than
        // 'index.html' and is used for Multi-Page Applications.
        extensions: ['html'],
      },

      // Hot Module Replacement
      // webpack.HotModuleReplacementPlugin is required to fully enable HMR.
      hot: true,
    },

    // ================================== //
    // ========== Optimization ========== //
    // ================================== //
    optimization: {
      // *** SplitChunksPlugin ***
      // The SplitChunksPlugin optimise imported modules (chunks) via preventing
      // duplicated chunks from being generated. Duplicated chunks could be
      // generated if files import (require) the same dependencies (common
      // dependencies).
      // Note: extra configuration in prod
      splitChunks: {
        // By default, optimization.splitChunks only works for async chunks.
        // This tell webpack to optimise both async and non-async (initial)
        // imports.
        // Note that optimising initial imports will affect the script tags in
        // the HTML file.
        chunks: 'all',

        // Since the chunk name includes all origin chunk names it’s
        // recommended for production builds with long term caching to NOT
        // include [name] in the filenames, or switch off name generation
        // via optimization.splitChunks.name: false
        name: !devMode,

        // *** Split conditions ***
        // The split conditions are ranked in order of priority. Commented out
        // values are default values and thus no need to be specified.

        // 1. Chunks must be at least this large (in b) to be generated.
        // minSize: 30000

        // 2. Chunks larger than this (in b) will be split further. New chunks
        // will be at least minSize. maxSize could be violated when a single
        // module is bigger than maxSize or when new chunks are smaller than
        // minSize.
        // maxSize: 0

        // 3 & 4. Maximum number of parallel requests for on-demand (lazy)
        // loading and entry point loading
        // maxAsyncRequests: 5
        // maxInitialRequests: 3

        // By default, there are two cache groups: 'vendors' and 'default'
        cacheGroups: {
          // This 'vendors' cache group will extract third-party libraries to
          // a separate 'vendors' chunk. We want this because third-party
          // libraries are less likely to change and consequently bust our
          // cache.
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: 'vendors',
          },
        },
      },

      // occurrenceOrder keeps filename consistent between different modes (for
      // example building only).
      occurrenceOrder: true,

      // This is relevant to caching. By default, the [contenthash] of an input
      // file will change between webpack builds even if the input's contents
      // stay the same. This is because webpack's runtime (or boilerplate) code
      // is ingrained into [contenthash].
      // We fix this by extracting out the runtime code using the runtimeChunk
      // property.
      // 'single': webpack generates one single chunk containing runtime code.
      // 'multiple': webpack generates one chunk for each entry point containing
      // runtime code.
      runtimeChunk: devMode ? true : 'single',

      minimizer: devMode
        ? []
        : [
            // For production, terser-webpack-plugin is a new JavaScript
            // minifier that uses TerserJS to replace the deprecated UglifyJS.
            // https://github.com/webpack-contrib/terser-webpack-plugin
            new TerserPlugin({
              // Enable file caching
              cache: true,

              // Use multi-process parallel running to improve the build speed.
              // Default number of concurrent runs is number of cpus - 1.
              parallel: true,
            }),

            // For production, cssnano is used to optimise CSS.
            new OptimizeCSSAssetsPlugin({
              cssProcessor: cssnano,
            }),
          ],
    },

    // ============================= //
    // ========== Context ========== //
    // ============================= //
    // This points to the base directory that contains the entry files. By
    // default the current directory is used.
    // https://webpack.js.org/configuration/entry-context/#context
    context: runtimeConfig.dirname,

    // ============================= //
    // ========== Records ========== //
    // ============================= //
    // webpack records are pieces of data that store module identifiers across
    // multiple builds. They can be used to track how modules change between
    // builds. webpack records are useful for monitoring whether our output
    // chunks are achieving the intended caching behaviours.
    // https://webpack.js.org/configuration/other-options/#recordspath
    recordsPath: path.join(runtimeConfig.dirname, 'webpackRecords.json'),
  };
};
