'use strict';
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}
// 默认端口为 8080
const port = 8080;
// const port = process.env.port || 8080;
const isDev = process.env.NODE_ENV === 'development';
const VUE_APP_BASE_API = '/dev-api';
const name = 'nodeChatRoom';
// 输出顺序 1 7 6 8 9 11 10 12 2 4 3 5
console.log('1');
      setTimeout(function() {
        console.log('2');
        process.nextTick(function() {
          console.log('3');
        });
        new Promise(function(resolve) {
          console.log('4');
          resolve();
        }).then(function() {
          console.log('5');
        });
      }, 3000);
      process.nextTick(function() {
        console.log('6');
      });
      new Promise(function(resolve) {
        console.log('7');
        resolve();
      }).then(function() {
        console.log('8');
      });
      setTimeout(function() {
        console.log('9');
        process.nextTick(function() {
          console.log('10');
        });
        new Promise(function(resolve) {
          console.log('11');
          resolve();
        }).then(function() {
          console.log('12');
        });
      }, 1000);
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: isDev ? '/' : '/',
  outputDir: 'docs',
  assetsDir: 'static',
  lintOnSave: isDev,
  productionSourceMap: isDev, // 开发环境打开源码模式
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: isDev ? 'http://localhost:3000' : 'http://云服务公网ip:3000',
        changeOrigin: true,
        pathRewrite: {
          ['^' + VUE_APP_BASE_API]: ''
        }
      }
    }
    // after: require('./mock/mock-server.js') // 启动有问题，未解决
  },
  css: {
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      }
    }
  },
  configureWebpack: config => {
    if (isDev) {
      // 开发环境配置
      config.devtool = 'source-map';
    }
    config.name = name;
    config.resolve.alias = {
      '@': resolve('src')
    };
  },
  chainWebpack(config) {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config =>
        config.devtool('cheap-source-map')
      );

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end();
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk('single');
    });
  }
};