const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: {
        app: './client/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../client/dist'),
        filename: "page/index.js"
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
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom',
            fetch: 'isomorphic-fetch',
            Promise: 'bluebird'
        })
    ]
}