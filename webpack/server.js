const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: {
        index: './page/index.js',
        detail:'./page/detail.js'
    },
    output: {
        path: path.resolve(__dirname, '../server/dist'),
        filename: "page/[name].js",
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
            }
        ]
    },
    target: 'node',
    resolve: {
        extensions: ['.js', '.jsx']
    }
}