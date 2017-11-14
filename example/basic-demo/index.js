import React from 'react'
import { Provider } from 'react-redux'
import App from './app'
import ReactDOM from 'react-dom'

//获取服务器数据
const AppDOM = document.getElementById('wrap')
const Obj = document.getElementById('data')
const DataState = JSON.parse(Obj.getAttribute("data-state"))
Obj.remove()

ReactDOM.render(
    <App {...DataState}/>   
    ,
    AppDOM
)