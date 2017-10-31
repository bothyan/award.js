import 'react-hot-loader/patch'
import React from 'react'
import App from '../src/app'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import configureStore from '../src/store'

//获取服务器数据
const AppDOM = document.getElementById('wrap')
const Obj = document.getElementById('data')
const DataState = JSON.parse(Obj.getAttribute("data-state"))
Obj.remove()

//存储store
DataState.first = true
const store = configureStore(DataState)

ReactDOM.render(
    <AppContainer>
        <App store={store} />
    </AppContainer>    
    ,
    AppDOM
)