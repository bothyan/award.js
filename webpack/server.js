const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: {
        app: './page/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../server/dist'),
        filename: "page/index.js",
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    "presets": ['react', 'es2015']
                }
            },
        ]
    }
}