'use strict';

var webpack = require('webpack');
var path = require('path');
var routes = require('../routes');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var entry = {
    'document': './document.js'
};

routes.map(function (item) {
    entry[item.page] = './src/page/' + item.page + '.js';
});

module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, '../.server'),
        filename: "page/[name].js",
        libraryTarget: 'commonjs2',
        strictModuleExceptionHandling: true,
        chunkFilename: '[name]'
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: []
            }
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!sass-loader'
            })
        }]
    },
    target: 'node',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [new ExtractTextPlugin('style/[name].css'), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]
};