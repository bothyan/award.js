
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import withRedux from '../hoc/redux-wraper'
import nextReduxSaga from '../hoc/redux-saga'
import reducers from '../reducer'
import rootSaga from '../saga'

export default function configureStore(initialState) { 
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducers, initialState, applyMiddleware(sagaMiddleware))

    store.sagaTask = sagaMiddleware.run(rootSaga)
    
    return store
}

export function withReduxSaga (BaseComponent) {
  return withRedux(configureStore)(nextReduxSaga(BaseComponent))
}
