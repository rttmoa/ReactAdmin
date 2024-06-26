/* eslint-disable func-names */
// eslint-disable-next-line lines-around-directive
'use strict'
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 一个抽离出css的webpack插件！

// dz config
exports.cssLoader = function (opts) {
  function generateLoaders(loader, loaderOpts) {
    const loaders = [
      {
        // 默认loader
        loader: 'css-loader',
        options: {
          minimize: process.env.NODE_ENV === 'production',
          sourceMap: opts.sourceMap,
          ...(loader && loader.indexOf('modules') !== -1
            ? {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              }
            : {}),
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: opts.sourceMap,
          config: {
            path: 'postcss.config.js',
          },
        },
      },
    ]
    if (loader && loader.indexOf('css') === -1) {
      // 需要增加的loader
      loaders.push({
        loader: `${loader.split('_')[0]}-loader`,
        options: { ...loaderOpts, sourceMap: opts.sourceMap },
      })
    }

    if (opts.extract) {
      // 是否需要抽离css
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader',
        publicPath: '../../', // 抽离出来的css 添加路径前缀, 让其打包出来的路径正确
      })
    }
    return ['style-loader'].concat(loaders)
  }
  return {
    css: generateLoaders(),
    css_modules: generateLoaders('css_modules'),
    less: generateLoaders('less'),
    less_modules: generateLoaders('less_modules'),
  }
}

exports.styleLoader = function (opts) {
  const output = []
  const cssLoaders = exports.cssLoader(opts)
  // let commonStylePath = [path.resolve(__dirname, '../src/styles'), path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../src/components')]
  const commonStylePath = [path.resolve(__dirname, '../src/views/CSSModule')]
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const extension in cssLoaders) {
    const loader = cssLoaders[extension]
    const rule = {
      test: new RegExp(`\\.${extension.split('_')[0]}$`), // 路径匹配
      use: loader,
    }
    if (extension.indexOf('modules') !== -1) {
      rule.include = commonStylePath
    } else {
      rule.exclude = commonStylePath
    }
    // if (extension.indexOf('modules') === -1) {
    //     rule.include = commonStylePath
    // } else {
    //     rule.exclude = commonStylePath
    // }
    output.push(rule)
  }
  return output
}
