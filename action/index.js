import * as constant from '../constant'

export function RECEIVE_USER(data) {
    return { type: constant.RECEIVE_USER , data }
}

export function BEIGIN_RECEIVE_USER() { 
    return { type: constant.BEIGIN_RECEIVE_USER }
}

export function RECEIVE_TODO(todoList) { 
    return {
        type: constant.RECEIVE_TODO,
        todoList
    }
}

export function ADD_TODO(data) { 
    return {
        type: constant.ADD_TODO,
        data
    }
}

export function DEL_TODO(data) { 
    return {
        type: constant.DEL_TODO,
        data
    }
}

export function FINISH_TODO(data) { 
    return {
        type: constant.FINISH_TODO,
        data
    }
}