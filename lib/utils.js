
//判断是否在服务器上运行
export const isInServer = () => {
    return typeof AWARD_InServer != 'undefined' && AWARD_InServer
}

//判断是否处理路由
export const isHandleRouter = () => {
    return typeof AWARD_ROUTE != 'undefined' && AWARD_ROUTE
}

// 打印
export function printAndExit(message, code = 1) {
    if (code === 0) {
        console.log(message)
    } else {
        console.error(message)
    }

    process.exit(code)
}

//判断对象是否为空
export const isEmptyObj = (obj) => { 
    let empty = true
    for (let key in obj) { 
        empty = false
    }
    return empty
}

//创建所有的header信息
export const createHeaderElements = (props,callback) => { 
    if (isEmptyObj(props.header) === false) {
        for (let key in props.header) {

            const headerData = props.header[key]

            if (typeof headerData != 'object') {
                //直接字符串赋值
                callback(key, {children:headerData})
            } else {
                if (headerData instanceof Array) {
                    //数组
                    if (headerData.length) {
                        headerData.map(item => {
                            callback(key, item)
                        })
                    }
                } else if (headerData instanceof Object) {
                    //对象
                    callback(key, headerData)
                }
            }    
        }

        if (props.header.hasOwnProperty('meta') === false) {
            callback('meta', { 'charSet': 'utf-8' })
        }

        if (props.header.hasOwnProperty('title') === false) {
            callback('title', { 'name': 'award-head' })
        }

    } else {
        callback('meta', { 'charSet': 'utf-8' })
        callback('title', { 'name': 'award-head' })
    }
}