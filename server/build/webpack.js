import webpack from 'webpack'
import { resolve,join } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import glob from 'glob-promise'
import WriteFilePlugin from 'write-file-webpack-plugin'
import PagesPlugin from './plugins/page-plugin'
import TestPlugin from './plugins/test-plugin'
import * as babelCore from 'babel-core'
import _ from 'lodash'

export default async function createCompiler(dir, routes) {
    
    const document = await glob('document.js', { cwd: dir })

    let entry = {
        'main.js': join(__dirname, '..', '..', 'client/index.js')
    }

    if (document.length) {
        entry.push({
            'bundles/page/document.js':join(dir,'./document.js')
        })
    }
    
    routes.map(item => { 
        entry[`bundles/page/${item.page}.js`] = join(dir,`./page/${item.page}.js`)
    })

    entry = _.mapValues(entry, val => [
        'webpack-hot-middleware/client?path=/_client/webpack-hmr&timeout=2000',
        val
    ])

    const webpackConfig = {
        entry,
        output: {
            path: resolve(dir, './.server'),
            filename: "[name]",
            libraryTarget: 'commonjs2',
            publicPath: '/_client/top/webpack',
            strictModuleExceptionHandling: true,
            chunkFilename: '[name]'
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader!sass-loader'
                    })
                },
                {
                    test: /\.js(\?[^?]*)?$/,
                    loader: 'hot-self-accept-loader',
                    include: [dir],
                },
                {
                    test: /\.js(\?[^?]*)?$/,
                    loader: 'react-hot-loader/webpack',
                    exclude: /node_modules/
                },
                {
                    test: /\.(js|json)(\?[^?]*)?$/,
                    loader: 'emit-file-loader',
                    include: [dir],
                    options: {
                        name: 'dist/[path][name].[ext]',                    
                        transform ({ content, sourceMap, interpolatedName }) {
                            // Only handle .js files
                            if (!(/\.js$/.test(interpolatedName))) {
                                return { content, sourceMap }
                            }

                            const transpiled = babelCore.transform(content, {
                                babelrc: false,
                                sourceMaps: false,
                                inputSourceMap: sourceMap
                            })

                            return {
                                content: transpiled.code,
                                sourceMap: transpiled.map
                            }
                        }
                    }
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ["react", "es2015", "stage-0"],
                        plugins: ["react-require","transform-runtime"]
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        resolveLoader: {
            modules: [
                join(__dirname, '..', '..', '..', 'node_modules'),
                'node_modules',
                join(__dirname, 'loaders')
            ]
          },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            }),
            
            new ExtractTextPlugin('style/[name].css'),

            // 输出webpack编译的文件
            new WriteFilePlugin({
                exitOnErrors: false,
                log: false,
                // required not to cache removed files
                useHashIndex: false
            }),

            new PagesPlugin(),

            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),

            new TestPlugin()
        ]
    }
    return webpack(webpackConfig)
}