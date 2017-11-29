
//判断是否在服务器上运行
export const isInServer = () => {
    return typeof SWRN_InServer != 'undefined' && SWRN_InServer
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