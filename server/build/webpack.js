import webpack from 'webpack'
import { resolve, join , sep} from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import glob from 'glob-promise'
import WriteFilePlugin from 'write-file-webpack-plugin'
import PagesPlugin from './plugins/page-plugin'
import CombineAssetsPlugin from './plugins/combine-assets-plugin'
import _ from 'lodash'

export const buildWebpack = async ({ dir, dist, routes = {} }) => { 
        
    const entry = {}

    const _error = await glob('error.js', { cwd: dir })

    if (_error.length) {
        entry['bundles/error.js'] = join(dir, `error.js`)
    } else { 
        entry['bundles/error.js'] = join(__dirname, '..', '..', 'lib/error.js')
    }

    routes.map(item => {
        entry[join('bundles', item.page)] = join(dir, dist , 'dist' , item.page)
    })

    const totalPage = routes.filter(item=> item.path!=null).length

    entry['app.js'] = join(__dirname, '..', '..', 'client/award.js')
    
    let webpackConfig = {
        entry,
        output: {
            path: resolve(dir, `./${dist}`),
            libraryTarget: 'commonjs2',
            filename: "[name]",
            chunkFilename: "[name]",
            strictModuleExceptionHandling: true
        }, 
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ["react", "es2015", "stage-0"],
                        plugins: ["react-require","transform-runtime",
                            [
                                require.resolve('babel-plugin-module-resolver'),
                                {
                                    alias: {
                                        'award/router': require.resolve('../../lib/router')
                                    }
                                }
                            ]
                        ]
                    }
                }
            ]
        },
        plugins: [                        
            new WriteFilePlugin({
                exitOnErrors: false,
                log: false,
                useHashIndex: false
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name:'common',
                filename: 'common.js',
                minChunks (module, count) {
                    
                    if (module.context && module.context.indexOf(`${sep}react-dom${sep}`) >= 0) {
                      return true
                    }

                    if(totalPage < 2){
                        return false
                    }
                    
                    return count >= totalPage * 0.5
                    
                }
            }),            
            new webpack.optimize.CommonsChunkPlugin({
                name:'manifest',
                filename: 'manifest.js'
            }),
            new CombineAssetsPlugin({
                input: ['manifest.js', 'common.js', 'app.js'],
                output: 'main.js'
            }),
            new PagesPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false },
                sourceMap: false
            }),
            new webpack.optimize.ModuleConcatenationPlugin()            
        ]
    }  

    return webpack(webpackConfig)
                
}

export default async function createCompiler({ dir, dev, dist, page, routes = {}, entry, assetPrefix }) {
    
    if (!entry) {

        const _main = await glob('main.js', { cwd: dir })
        const _error = await glob('error.js', { cwd: dir })
        
        entry = {}

        if (dev) {
            entry['main.js'] = join(__dirname, '..', '..', 'client/award-dev.js')
        }    

        if (_main.length) {
            entry['bundles/main.js'] = join(dir, `main.js`)
        }

        if (_error.length) {
            entry['bundles/error.js'] = join(dir, `error.js`)
        } else { 
            entry['bundles/error.js'] = join(__dirname, '..', '..', 'lib/error.js')
        }

        routes.map(item => {
            entry[join('bundles', item.page)] = join(dir, item.page)
        })

        if (dev) {
            entry = _.mapValues(entry, val => [
                'webpack-hot-middleware/client?path=/_award/webpack-hmr&timeout=2000',
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

    const cssModuleOption = JSON.stringify({
        allowMultiple: true,
        handleNotFoundStyleName:'ignore'    
    })
    
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
                loader: 'style-loader!css-loader?modules!sass-loader'
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
                            name: 'dist/[path][name].award',
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
                        return { content, sourceMap:false }
                    }

                    /**
                     * 开发环境
                     * 客户端：  
                     *      传给下个流用的文件，var styles = require('./style/index.scss')
                     *      合并 style1 style2 style3 交给 cssmodules 传给webpack输出
                     * 服务端：
                     *      编译的流程和发布一样
                     * 
                     * 发布环境，不变，交给下次编译流程，让webpack再编译一次
                     */

                    //开发环境需要将styleName转为className
                    //发布环境不再使用className,所有的转化的styleName全部交给服务器提供class

                    if (!dev) { 
                        return {content}
                    }

                    //开发环境需要处理这些内容
                    let _content = `var _AWARD_STYLE = [] \n var _CSSModules = require('react-css-modules') \n`,    
                        _content_ = _content

                    let line = 0                    
                    content = `${content}\r\n`
                    for (let i = 0; i < content.length; i++) {
                        if (content[i].match(/\n/) != null) {
                            let res = ''
                            for (let j = line; j < i; j++) {
                                res += content[j]
                            }
                            res = res.replace(/(^\s*)|(\s*$)/g, "")

                            const _css = res.match(/require\(['"](.*)(\.css|less|scss)['"]\)/)
                            
                            if (_css != null) { 
                                res = res.replace(_css[0], `'';var _STYLE_${i} = ${_css[0]};_AWARD_STYLE.push(_STYLE_${i});`)
                            } 


                            //将这一行的export.default代码匹配出来
                            //exports.default = (0, _Login2.default)(LoginBtn);
                            //exports.default = LoginBtn;
                            const _default = res.match(/exports.default(.*);$/)
                
                            if (_default != null) {
                                //拿到等于号后面的值
                                let ComponentName = _default[1].replace(/[\s=]/g, '')
                                const _matchMore = ComponentName.match(/[^()]*[^()]/g)
                
                                res = `
                                var ComponentStyle = {};
                                _AWARD_STYLE = _AWARD_STYLE.filter(style => style != '')                                 
                                if (_AWARD_STYLE.length) { 
                                    for (var i = 0; i < _AWARD_STYLE.length; i++) { 
                                        for (var key in _AWARD_STYLE[i]) { 
                                            ComponentStyle[key] = _AWARD_STYLE[i][key];
                                        }
                                    }
                                `;
                                //判断是否有嵌套，即高阶组件的使用
                                if (_matchMore.length > 1) {
                                    ComponentName = _matchMore[_matchMore.length - 1]
                                    res += _default[0].replace(`(${ComponentName})`, `(_CSSModules(${ComponentName},ComponentStyle,${cssModuleOption}))`)
                                } else {
                                    res += `exports.default = _CSSModules(${ComponentName},ComponentStyle,${cssModuleOption});`
                                }
                                res += `
                                }else{
                                    ${_default[0]}
                                }`
                            }

                            _content += res + '\n'

                            //开发环境需要将styleName替换
                            const _className = res.match(/styleName['":]/g)

                            if (_className != null) {                                
                                _className.map(item => {
                                    let _match = item.match(/styleName(['":])/)
                                    res = res.replace(item, `stylename${_match[1]}`)
                                })
                            } 
                            
                            _content_ += res + '\n'
                            
                            line = i
                        }
                    } 
                    
                    return {
                        content: _content, //传文件
                        _content:_content_ //写文件
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
                plugins: ["react-require","transform-runtime",
                    [
                        require.resolve('babel-plugin-module-resolver'),
                        {
                            alias: {
                                'award/router': require.resolve('../../lib/router')
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

    let webpackConfig = {
        entry,
        output: {
            path: resolve(dir, `./${dist}`),
            filename: "[name]",
            publicPath: dev ? '/_award/webpack/' : `${assetPrefix}/`,
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