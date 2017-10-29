
/**
 * 合并所有的saga业务
 * 单个的saga写法查看子例子
 * 其主要作用是在这里会实现一些业务逻辑的处理
 */

import { fork } from 'redux-saga/effects'

import todo from './todo'
import detail from './detail'

export default function* () {
    yield fork(todo)
    yield fork(detail)
}
