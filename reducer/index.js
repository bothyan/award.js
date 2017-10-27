
import { combineReducers } from 'redux'
import * as constant from '../constant'

const app = (state, action) => {
    switch (action.type) {
        case constant.RECEIVE_TODO:
            return Object.assign({}, state, action)
            break;

        case constant.RECEIVE_TODO_DETAIL:
            return Object.assign({}, state, action)
            break;
    }

    return state
}

export default app