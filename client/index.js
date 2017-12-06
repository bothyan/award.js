import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import extend from 'extend'
import { Link, Router, Route, ResolveRouter } from 'award/router'
import App from '../lib/app'
import Loader from '../lib/loader'
import { createHeaderElements } from '../lib/utils'

//获取服务器数据
const dataObj = document.getElementById('data')
const serverData = JSON.parse(dataObj.getAttribute("data-state"))
dataObj.remove()

export let routeLoader

export default async () => {

    let Main, Component, initialProps = {}
    const { assetPrefix, route, routes } = serverData

    routeLoader = new Loader(assetPrefix)

    window.__AWARD_LOADED_PAGE__.forEach(({ route, fn }) => {
        routeLoader.registerPage(route, fn)
    })
    delete window.__AWARD_LOADED_PAGE__

    window.__AWARD_REGISTER_PAGE__ = async (route, fn) => {
        routeLoader.registerPage(route, fn)
    }

    Main = await routeLoader.loadPage('/main.js')

    // 首次加载页面 收集数据
    Component = await routeLoader.loadPage(route)
    
    const data = { ...serverData }
    const props = { data, routeLoader }

    if (!!Main) {
        props.Main = Main
        props.Component = Component
    } else {
        props.Main = Component
    }

    render(props)

    // 路由切换页面加载
    routeLoader.subscribe(async ({ Component, route }) => {

        initialProps = !Component.getInitialProps ? {} : await Component.getInitialProps()
 
        if (!!Main) {
            //对象深拷贝
            const MainProps = !Main.getInitialProps ? {} : await Main.getInitialProps()
            initialProps = extend(true, MainProps, initialProps)  
            
            props.Component = Component                     
        } else {
            props.Main = Component
        }

        //删除所有award-head
        Array.from(document.getElementsByClassName('award-head')).map(item => { 
            item.remove()
        }) 

        //创建新的award-head
        createHeaderElements(initialProps,createElement)
        delete initialProps.header
        
        props.data = { ...initialProps, assetPrefix, route, routes }  

        render(props)
    })
}

function render(props = {}) {
    ReactDOM.render(<App {...props} />, document.getElementById('main'))
}

function createElement(element,obj) { 
    var createObj = document.createElement(element)
    
    let children = obj.children
    if (!!children == false) {
        if (element == 'title') {
            children = 'Award Demo'
        } else {
            children = null
        }
    } else { 
        delete obj.children
    }

    obj.class = 'award-head'
        
    for (let key in obj) { 
        createObj.setAttribute(key,obj[key])
    }

    if (!!children) { 
        createObj.innerText = children
    }

    document.head.appendChild(createObj)
}

