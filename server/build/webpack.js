import webpack from 'webpack'
import { resolve, join } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import glob from 'glob-promise'
import WriteFilePlugin from 'write-file-webpack-plugin'
import PagesPlugin from './plugins/page-plugin'
import * as babelCore from 'babel-core'
import _ from 'lodash'

export default async function createCompiler({ dir, dev, dist, page, routes = {}, entry, assetPrefix }) {

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

    let extractCss = new ExtractTextPlugin('static/style/[name].css')

    // 根据环境定义loader规则
    const rules = []

    const _tmpCss = []
    
    const JsonFile = (cssFileName, json, outputFileName) => { 
        _tmpCss.push({
            filename: cssFileName,
            data:json
        })
    }
    
    if (dev) {
        rules.push(
            {
                test: /\.js$/,
                loader: 'hot-self-accept-loader',
                include: [join(dir, page)],
            }, {
                test: /\.js$/,
                loader: 'react-hot-loader/webpack',
                exclude: /node_modules/
            }, 
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!sass-loader'
            }                    
        )
        
    } else { 
        rules.push(
            {
                test: /\.scss$/,
                exclude: /node_modules/,                
                loader: extractCss.extract(['css-loader'])
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'emit-file-loader',
                        options: {
                            name: 'dist/[path][name].swrn',
                            transform({ content, sourceMap, interpolatedName, resource }) {                            
                                let _content = {}
                                _tmpCss.map(item => { 
                                    if (item.filename == resource) { 
                                        _content = item
                                    }
                                })
                                return {
                                    content,
                                    _content:JSON.stringify(_content)
                                }
                            }
                        }
                    },                
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins:[
                                require('postcss-cssnext')({
                                  warnForDuplicates: false
                                }),
                                require('postcss-modules')({
                                    generateScopedName: '[name]_[local]_[hash:base64:5]]',
                                    getJSON: function(cssFileName, json, outputFileName) {                                    
                                        JsonFile(cssFileName, json, outputFileName)
                                    }  
                                }),
                                require('cssnano')()
                            ]
                        }  
                    },
                    'sass-loader'
                ]                
            }
        )
    }

    rules.push(
        {
            test:/\.(png|gif|jpg|jpeg|bmp)$/, 
            exclude: /node_modules/,
            loader: 'file-loader?name=static/images/[name].[hash:8].[ext]'
        },
        { 
            test:/\.(woff|woff2|svg|ttf|eot)($|\?)/, 
            loader:'file-loader?name=static/fonts/[name].[hash:8].[ext]'
        },        
        {
            test: /\.js$/,
            loader: 'emit-file-loader',
            include: [dir, join(dir, page)],
            exclude: /node_modules/,
            options: {
                name: 'dist/[path][name].[ext]',
                transform({ content, sourceMap, interpolatedName }) {
                    if (!(/\.js$/.test(interpolatedName))) {
                        return { content, sourceMap }
                    }

                    //开发环境需要将styleName转为className
                    //发布环境不再使用className,所有的转化的styleName全部交给服务器提供class
                    const tag = dev ? 'className' : 'styleName'

                    let line = 0
                    let _content = ''
                    content = `${content}\r\n`
                    for (let i = 0; i < content.length; i++) {
                        if (content[i].match(/\n/) != null) {
                            let res = ''
                            for (let j = line; j < i; j++) {
                                res += content[j]
                            }
                            res = res.replace(/(^\s*)|(\s*$)/g, "")

                            //匹配styleName => className
                            //{ styleName: 'name' }
                            //'styleName'
                            //"styleName"
                            const _className = res.match(/[{'"\s]styleName['":]/g)
                        
                            if (_className != null) {
                                _className.map(item => {
                                    let _match = item.match(/([{'"\s])styleName(['":])/)
                                    res = res.replace(item, `${_match[1]}${tag}${_match[2]}`)
                                })
                            }
        
                            _content += res + '\n'
                            line = i
                        }
                    }    
                    return {
                        content: _content, //在webpack中传文件
                        _content: dev ? _content : content //写文件
                    }                      
                }
            }
        },
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                //"babili",
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
        }
    )

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
            publicPath: dev ? '/_swrn/webpack/' : `${assetPrefix}/`,
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