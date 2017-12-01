import glob from 'glob-promise'
import { resolve, join } from 'path'
import fs from 'fs'

const checkDistStaticSource = (content,distImages,options) => { 
    // 解析require的代码
    const { dev,assetPrefix,dir,path } = options
    var line = 0
    var _content = 'exports.swrn_style = [] \n'
    content = `${content}\r\n`
    for (let i = 0; i < content.length; i++) {
        if (content[i].match(/\n/) != null) {
            var res = ''
            for (let j = line; j < i; j++) {
                res += content[j]
            }
            res = res.replace(/(^\s*)|(\s*$)/g, "")

            //将这一行的require代码匹配出来
            const _require = res.match(/require\(['"][^'"]*['"]\)/g)
            
            if (_require != null) {
                _require.map(item => { 
                    //匹配css
                    const _css = item.match(/require\(['"](.*)(\.css|less|scss)['"]\)/)

                    if (_css != null) { 
                        //这里需要拿到css modules 对应的css json字符

                        //先获取存放键值对的 swrn文件
                        if (!dev) {
                            let _path = path.split('/')
                            _path.pop()
                            _path = _path.join('/')
                            _path = join(_path, `${_css[1]}swrn`)
                        
                            let cssJson = JSON.parse(fs.readFileSync(_path, "utf-8"))

                            res = res.replace(item, `''`) + '\n'
                        
                            //判断是不是空对象
                            const _cssdata = JSON.stringify(cssJson.data)
                            if (_cssdata != '{}') {
                                res = res + '\n' + `exports.swrn_style.push(${_cssdata})`
                            }
                        } else { 
                            res = res.replace(item, `''`) + '\n'
                        }    
                    }

                    //匹配图片
                    const _image = item.match(/require\(['"](.*)(\.jpg|jpeg|png|gif)['"]\)/)
                    if (_image != null) { 
                        let ImageUrl = ''

                        if (!dev) {
                            //path _image[1] ext _image[2]
                            let _path = _image[1].split('/').filter(item => item != '..' && item != '.')
                            _path.unshift('static')
                            _path = _path.join('/') // static/images/2

                            //创建正则规则
                            const _match = new RegExp(`${_path}\.(.*)\.${_image[2]}$`)
                        
                            distImages.map(item => {
                                if (item.match(_match) != null) {
                                    item = item.split('/')
                                    item.shift()
                                    ImageUrl = assetPrefix + '/' + item.join('/')
                                }
                            })
                        }    

                        // ${assetPrefix}/static/images/[name].[hash:8].[ext]
                        res = res.replace(item, `'${ImageUrl}'`)
                    }
                    
                })                   
            }            

            _content += res + '\n'
            line = i
        }
    }

    return _content
}

export const replaceStaticSource = (options) => {
    
    //读取dist目录下文件
    return new Promise( async (resolve,reject)=> {
        
        const distFile = await glob(`${options.dist}/dist/**/*.js`, { cwd: options.dir })
        const distImages = await glob(`${options.dist}/static/**/*`, { cwd: options.dir })
        
        if (distFile.length) { 
            distFile.map(item => { 
                const path = join(options.dir, item)
                options.path = path
                var content = checkDistStaticSource(fs.readFileSync(path, "utf-8"),distImages,options)
                fs.writeFileSync(path, content)
            })
        }

        resolve()
    
    })
}

export const replaceBundlesClassName = (options) => { 
    //读取bundle目录下文件
    return new Promise( async (resolve,reject)=> {
        
        const bundleFiles = await glob(`${options.dist}/bundles/**/*.js`, { cwd: options.dir })
        
        if (bundleFiles.length) { 
            bundleFiles.map(item => { 
                const path = join(options.dir, item)
                options.path = path
                var content = checkBundleClassName(fs.readFileSync(path, "utf-8"))
                fs.writeFileSync(path, content)
            })
        }

        resolve()
    
    })
}

const checkBundleClassName = (content) => { 
    var line = 0
    var _content = ''
    content = `${content}\r\n`
    for (let i = 0; i < content.length; i++) {
        if (content[i].match(/\n/) != null) {
            var res = ''
            for (let j = line; j < i; j++) {
                res += content[j]
            }
            res = res.replace(/(^\s*)|(\s*$)/g, "")

            //匹配styleName => className
            //{ styleName: 'name' }
            //'styleName'
            //"styleName"
            const _className = res.match(/[{'",\s]styleName['":]/g)
            
            if (_className != null) {
                _className.map(item => {
                    let _match = item.match(/([{'",\s])styleName(['":])/)
                    res = res.replace(item, `${_match[1]}className${_match[2]}`)
                })
            }

            _content += res + '\n'
            line = i
        }
    }

    return _content
}