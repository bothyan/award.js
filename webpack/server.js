const webpack = require('webpack')
const path = require('path')
let ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
    entry: {
        index: './src/page/home/index.js',
        detail:'./src/page/home/detail.js'
    },
    output: {
        path: path.resolve(__dirname, '../server/dist'),
        filename: "page/home/[name].js",
        libraryTarget: 'commonjs2',
        strictModuleExceptionHandling: true,
        chunkFilename: '[name]'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets:[]
                }
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            }
        ]
    },
    target: 'node',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new ExtractTextPlugin('style/[name].css'),         
    ]
}