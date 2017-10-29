/**
 * 合并所有的reducer
 * 单个reducer的写法可以看具体的文件例子
 */

import todo from './todo';
import detail from './detail'

const combinedReducer = Object.assign({},
	todo,
	detail
)

export default (state, action) => {

    //每次dispatch action都会调用reducer,有些是给saga用的action，这里要过滤一下
    if (action.type && combinedReducer[action.type]) {
        return combinedReducer[action.type](state, action)
    }

    return state

}
