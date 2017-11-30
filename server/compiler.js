import glob from 'glob-promise'
import { resolve, join } from 'path'
import fs from 'fs'

export const checkRequire = (content,distImages,dev,assetPrefix) => { 
    // 去除require的scss代码
    // 比如require('./index.scss') 将其删掉
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

            //匹配未注释的css代码
            var _res = res.match(/require\(['|"](.*)(\.(css|scss|jpg|png|gif|jpeg|less))['|"]\)/)
            
            if (_res == null) {
                _content += res + '\n'
            } else { 
                //检测import引用 图片            
                res = res.replace(/(\s*)/g, "")
                var _res = res.match(/^var(.*)=require\(['|"](.*)(\.(jpg|png|gif|jpeg))['|"]\)/)
            
                if (_res != null) {
                    let ImageUrl = ''
                    if (!dev) {
                        // path _res[2] ext _res[3]
                        let _path = _res[2].split('/').filter(item => item != '..' && item != '.')
                        _path.unshift('static')
                        _path = _path.join('/') // static/images/2

                        //创建正则规则
                        const _match = new RegExp(`${_path}\.(.*)\.${_res[3]}$`)

                        distImages.map(item => {
                            if (item.match(_match) != null) {
                                item = item.split('/')
                                item.shift()
                                ImageUrl = assetPrefix + '/' + item.join('/')
                            }
                        })
                    } 
                    // ${assetPrefix}/static/images/[name].[hash:8].[ext]
                    _content += `var ${_res[1]} = '${ImageUrl}' \n`
                }
                   
            }
            line = i
        }
    }

    return _content
}

export const replaceImages = (options) => {
    
    //读取dist目录下文件
    return new Promise( async (resolve,reject)=> {
        
        const distFile = await glob(`${options.dist}/dist/**/*.js`, { cwd: options.dir })
        const distImages = await glob(`${options.dist}/static/**/*`, { cwd: options.dir })
        
        if (distFile.length) { 
            distFile.map(item => { 
                const path = join(options.dir, item)
                var content = checkRequire(fs.readFileSync(path, "utf-8"),distImages,options.dev,options.assetPrefix)
                fs.writeFileSync(path, content)
            })
        }

        resolve()
    
    })
}