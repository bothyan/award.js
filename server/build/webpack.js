import webpack from 'webpack'
import { resolve, join } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import glob from 'glob-promise'
import WriteFilePlugin from 'write-file-webpack-plugin'
import PagesPlugin from './plugins/page-plugin'
import * as babelCore from 'babel-core'
import _ from 'lodash'

export default async function createCompiler({ dir, dev, dist, page, routes = {}, entry }) {

    if (!entry) {

        const _main = await glob('main.js', { cwd: dir })

        entry = {
            'main.js': join(__dirname, '..', '..', dev ? 'client/swrn-dev.js' : 'client/swrn.js')
        }

        if (_main.length) {
            entry['bundles/main.js'] = join(dir, `main.js`)
        }

        routes.map(item => {
            entry[join('bundles', item.page)] = join(dir, item.page)
        })

        if (dev) {
            entry = _.mapValues(entry, val => [
                'webpack-hot-middleware/client?path=/_swrn/webpack-hmr&timeout=2000',
                val
            ])
        }    
    }

    let extractCss = new ExtractTextPlugin('style/[name].css')

    // 根据环境定义loader规则
    const rules = []
    
    if (dev) {
        rules.push(
            {
                test: /\.js(\?[^?]*)?$/,
                loader: 'hot-self-accept-loader',
                include: [join(dir, page)],
            }, {
                test: /\.js(\?[^?]*)?$/,
                loader: 'react-hot-loader/webpack',
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!sass-loader'
            }, {
                test: /\.(jpg|png)$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            }
        )
        
    } else { 
        rules.push(
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: extractCss.extract(['css-loader', 'sass-loader'])
            },{
                test: /\.(jpg|png)$/,
                exclude: /node_modules/,
                loader: 'file-loader?name=images/[name].[hash:8].[ext]'
            }
        )
    }

    rules.push({
        test: /\.(js|json)(\?[^?]*)?$/,
        loader: 'emit-file-loader',
        include: [dir, join(dir, page)],
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: ["react", "es2015", "stage-0"],
            plugins: ["react-require", "transform-runtime",
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
    })

    // 根据环境定义插件
    const plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': dev ? JSON.stringify('development') : JSON.stringify('production')
        }),
        // 输出webpack编译的文件
        new WriteFilePlugin({
            exitOnErrors: false,
            log: false,
            useHashIndex: false
        }),
        new PagesPlugin()
    ]

    if (dev) {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        )
    } else { 
        plugins.push(
            extractCss,
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false },
                sourceMap: false
            }),
            new webpack.optimize.ModuleConcatenationPlugin()
        )
    }

    const webpackConfig = {
        entry,
        output: {
            path: resolve(dir, `./${dist}`),
            filename: "[name]",
            publicPath: dev ? '/_swrn/webpack/' : '/swrn/',
            libraryTarget: 'commonjs2',
            strictModuleExceptionHandling: true,
            chunkFilename: '[name]'
        },
        module: {
            rules
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
        plugins
    }
    return webpack(webpackConfig)
}