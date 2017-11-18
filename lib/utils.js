
//判断是否在服务器上运行
export const isInServer = ()=>{ 
    return typeof SWRN_InServer != 'undefined' && SWRN_InServer
}