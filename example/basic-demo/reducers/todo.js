import * as constant from '../constants'
const reducer = {}

reducer[constant.RECEIVE_TODO] = (state, action) => { 
    return Object.assign({}, state, action)
}

export default reducer
