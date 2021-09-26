const {
  addBeforeLoader,
  loaderByName,
  throwUnexpectedConfigError,
  ESLINT_MODES
} = require('@craco/craco');

const webpack = require('webpack');

const throwError = (message) =>
  throwUnexpectedConfigError({
    packageName: 'craco',
    githubRepo: 'gsoft-inc/craco',
    message,
    githubIssueQuery: 'webpack'
  });

module.exports = {
  eslint: {
    mode: ESLINT_MODES.file
  },
  webpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
        'global.jQuery': 'jquery'
      })
    ],
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensions.push('.html');

      const htmlLoader = {
        loader: require.resolve('html-loader'),
        test: /\.html$/
      };

      if (!htmlLoader) throwError('failed to load html-loader');

      addBeforeLoader(webpackConfig, loaderByName('file-loader'), htmlLoader);

      return webpackConfig;
    }
  }
};
