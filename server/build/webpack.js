import webpack from 'webpack'
import { resolve, join } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import glob from 'glob-promise'
import WriteFilePlugin from 'write-file-webpack-plugin'
import PagesPlugin from './plugins/page-plugin'
import TestPlugin from './plugins/test-plugin'
import * as babelCore from 'babel-core'
import _ from 'lodash'

export default async function createCompiler(dir, routes = {}, hasEntry = false) {

    let entry

    if (!hasEntry) {

        const _main = await glob('main.js', { cwd: dir })

        entry = {
            'main.js': join(__dirname, '..', '..', 'client/index.js')
        }

        if (_main.length) {
            entry['bundles/main.js'] = join(dir, `main.js`)
        }

        routes.map(item => {
            entry[join('bundles', item.page)] = join(dir, item.page)
        })

        entry = _.mapValues(entry, val => [
            'webpack-hot-middleware/client?path=/_swrn/webpack-hmr&timeout=2000',
            val
        ])

    } else {
        entry = hasEntry
    }

    let extractCss = new ExtractTextPlugin('style/[name].css')

    const webpackConfig = {
        entry,
        output: {
            path: resolve(dir, './.server'),
            filename: "[name]",
            publicPath: '/_swrn/webpack/',
            strictModuleExceptionHandling: true,
            chunkFilename: '[name]'
        },
        module: {
            rules: [                
                {
                    test: /\.js(\?[^?]*)?$/,
                    loader: 'hot-self-accept-loader',
                    include: [join(dir,'page')],
                },
                {
                    test: /\.js(\?[^?]*)?$/,
                    loader: 'react-hot-loader/webpack',
                    exclude: /node_modules/
                },
                {
                    test: /\.(js|json)(\?[^?]*)?$/,
                    loader: 'emit-file-loader',
                    include: [dir, join(dir, 'page')],
                    exclude: /node_modules/,
                    options: {
                        name: 'dist/[path][name].[ext]',
                        transform({ content, sourceMap, interpolatedName }) {
                            // Only handle .js files
                            if (!(/\.js$/.test(interpolatedName))) {
                                return { content, sourceMap }
                            }

                            // 去除require的scss代码
                            // 比如require('./index.scss') 将其删掉
                            var line = 0
                            var style = []
                            var _content = ''
                            content = `${content}\r\n`
                            for (let i = 0; i < content.length; i++) {
                                if (content[i].match(/\n/) != null) {
                                    var res = ''
                                    for (let j = line; j < i; j++) {
                                        res += content[j]
                                    }

                                    res = res.replace(/(^\s*)|(\s*$)/g, "")

                                    //注释行信息
                                    if (res.substr(0, 2) == "//") {
                                        // console.log(res)
                                    }

                                    //匹配未注释的css代码
                                    var _res = res.match(/^require\(['|"](.*)(\.(css|scss))['|"]\)/)

                                    if (_res != null) {
                                        res = ''
                                        var _tmp = _res[1] + _res[2]
                                        style.push(_tmp)
                                    }

                                    _content += res + '\n'

                                    line = i
                                }
                            }                            

                            return {
                                content,
                                _content
                            }
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    loader:extractCss.extract(['css-loader','sass-loader'])                    
                },                               
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ["react", "es2015", "stage-0"],
                        plugins: ["react-require", "transform-runtime",
                            [require.resolve('babel-plugin-transform-react-jsx')],
                            [require.resolve('babel-plugin-react-css-modules')],
                            [
                                require.resolve('babel-plugin-module-resolver'),
                                {
                                    alias: {
                                        'swrn/router': require.resolve('../../lib/router')
                                    }
                                }
                            ]
                        ]
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

            extractCss,

            // 输出webpack编译的文件
            new WriteFilePlugin({
                exitOnErrors: false,
                log: false,
                // required not to cache removed files
                useHashIndex: false
            }),

            new PagesPlugin(),

            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ]
    }
    return webpack(webpackConfig)
}