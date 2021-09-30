# React-Slickgrid
An attempt to use Slickgrid Universal Vanila bundle in React using Create-React-App and CRACO. 
 
## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## CRACO

[![NPM Status](https://img.shields.io/npm/v/@craco/craco.svg)](https://www.npmjs.com/package/@craco/craco)
[![Build Status](https://img.shields.io/travis/gsoft-inc/craco/master.svg?style=flat&label=travis)](https://travis-ci.org/gsoft-inc/craco)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/sharegate/craco/pulls)

[![NPM Downloads](https://img.shields.io/npm/dm/@craco/craco.svg)](https://www.npmjs.com/package/@craco/craco)

**C**reate **R**eact **A**pp **C**onfiguration **O**verride is an easy and comprehensible configuration layer for create-react-app.

Get all the benefits of create-react-app **and** customization without using 'eject' by adding a single `craco.config.js` file at the root of your application and customize your eslint, babel, postcss configurations and many more.

All you have to do is create your app using [create-react-app](https://github.com/facebook/create-react-app/) and customize the configuration with a `craco.config.js` file.

## Support

- Create React App (CRA) 4.*
- Yarn
- Yarn Workspace
- NPM
- Lerna (with or without hoisting)
- Custom `react-scripts` version

For reference: https://github.com/gsoft-inc/craco

# Modifications to use Slickgrid

## Create a craco.config.js with the following code:

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
        
## Install the following packages as dependencies:

    @slickgrid-universal/common
    @slickgrid-universal/composite-editor-component
    @slickgrid-universal/custom-footer-component
    @slickgrid-universal/empty-warning-component
    @slickgrid-universal/event-pub-sub
    @slickgrid-universal/excel-export
    @slickgrid-universal/graphql
    @slickgrid-universal/odata
    @slickgrid-universal/pagination-component
    @slickgrid-universal/rxjs-observable
    @slickgrid-universal/text-expor
    @slickgrid-universal/vanilla-bundle
    bulma
    jquery
    jquery-ui-bundle
    multiple-select-modified
    sass

## Install the following dependencies as dev dependencies:

    @craco/craco
    @types/jquery
    eslint-config-prettier
    eslint-plugin-prettier
    html-loader@1
    prettier

**A postinstall script is executed after npm install to set some files needed by Slickgrid** 

Look at postinstall.js at the root folder.