
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import withRedux from './hocs/redux-wraper'
import nextReduxSaga from './hocs/redux-saga'
import reducers from './reducers'
import saga from './sagas'

export default function configureStore(initialState) { 
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducers, initialState, applyMiddleware(sagaMiddleware))

    store.sagaTask = sagaMiddleware.run(saga)
    
    return store
}

export function withReduxSaga (BaseComponent) {
  return withRedux(configureStore)(nextReduxSaga(BaseComponent))
}
