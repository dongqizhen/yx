"use strict";

///bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
    return path.join(__dirname, dir);
}

const name = defaultSettings.title || ""; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: false, //process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    transpileDependencies: ['element-ui', 'vuex'], //兼容ie
    devServer: {
        port: port,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            "/dev-api": {
                // target: 'http://192.168.2.230:3000',
                // target: "http://192.168.2.222:3001",
                // target: "http://192.168.2.224:3001",
                target: "http://pre.wecho.com.cn",
                //target: "http://art.wecho.com.cn",
                changeOrigin: true,
                pathRewrite: {
                    "^/dev-api": ""
                }
            }
        }
        // before: require("./mock/mock-server.js")
    },
    configureWebpack: config => {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
        return {
            name: name,
            resolve: {
                alias: {
                    "@": resolve("src")
                }
            },
        }


    },
    chainWebpack(config) {
        config.plugins.delete("preload"); // TODO: need test
        config.plugins.delete("prefetch"); // TODO: need test
        config.entry("main").add("@babel/polyfill");

        // set svg-sprite-loader
        config.module
            .rule("svg")
            .exclude.add(resolve("src/icons"))
            .end();
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]"
            })
            .end();

        // set preserveWhitespace
        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true;
                return options;
            })
            .end();

        config
        // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === "development", config =>
            config.devtool("cheap-source-map")
        );

        config.when(process.env.NODE_ENV !== "development", config => {
            config
                .plugin("ScriptExtHtmlWebpackPlugin")
                .after("html")
                .use("script-ext-html-webpack-plugin", [{
                    // `runtime` must same as runtimeChunk name. default is `runtime`
                    inline: /runtime\..*\.js$/
                }])
                .end();
            config.optimization.splitChunks({
                chunks: "all",
                cacheGroups: {
                    libs: {
                        name: "chunk-libs",
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: "initial" // only package third parties that are initially dependent
                    },
                    elementUI: {
                        name: "chunk-elementUI", // split elementUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                    },
                    commons: {
                        name: "chunk-commons",
                        test: resolve("src/components"), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            });
            config.optimization.runtimeChunk("single");

        });
    }
};