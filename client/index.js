import React from 'react'
import { Provider } from 'react-redux'
import App from './app'
import ReactDOM from 'react-dom'
import configureStore from '../src/store'

import '../src'

//获取服务器数据
const AppDOM = document.getElementById('wrap')
const Obj = document.getElementById('data')
const DataState = JSON.parse(Obj.getAttribute("data-state"))
Obj.remove()

//存储store
React.load = false
const store = configureStore(DataState)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>    
    ,
    AppDOM
)