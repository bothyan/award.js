const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './client/index.js',
        vendor: [   // 这里是依赖的库文件配置，和CommonsChunkPlugin配合使用可以单独打包
            'react',
            'react-dom',
            'react-redux',
            'redux',
            'redux-saga',
            'axios'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../client/dist'),
        filename: "[name].js",
        chunkFilename: '[name]'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },{
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'main.js'
        }),

        //js代码压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
            //supresses warnings, usually from module minification
            warnings: false
            },
            beautify:false,
            comments:false
        }),

        // 定义为生产环境，编译 React 时压缩到最小
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),

        new ExtractTextPlugin('style/[name].css')
    ]
}