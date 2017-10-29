import * as constant from '../constants'
const reducer = {}

reducer[constant.RECEIVE_TODO_DETAIL] = (state, action) => { 
    return Object.assign({}, state, action)
}

export default reducer
