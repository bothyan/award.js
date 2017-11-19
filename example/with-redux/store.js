import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

export const actionTypes = {
    ADD: 'ADD'
}

const exampleInitialState = {
    count: 0
  }

export const reducer = (state=exampleInitialState, action) => { 
    switch (action.type) { 
        case actionTypes.ADD:
            console.log(2)    
            return Object.assign({}, state, {
                count: state.count + 2
            })
        default: return state
    }
}

//action

export const add = () => dispatch => { 
    return dispatch({ type: actionTypes.ADD })
}

export const initStore = (initiState=exampleInitialState) => { 
    return createStore(reducer,initiState,composeWithDevTools(applyMiddleware(thunkMiddleware)))
}