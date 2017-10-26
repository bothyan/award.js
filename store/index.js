
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from '../reducer'
import rootSaga from '../saga'

export default function configureStore(initialState) { 
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducers, initialState, applyMiddleware(sagaMiddleware))

    sagaMiddleware.run(rootSaga)

    return store
}