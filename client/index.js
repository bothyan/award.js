import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link, Router, Route, ResolveRouter } from 'swrn/router'
import App from '../lib/app'
import Loader from '../lib/loader'

//获取服务器数据
const dataObj = document.getElementById('data')
const serverData = JSON.parse(dataObj.getAttribute("data-state"))
dataObj.remove()

export let routeLoader

export default async () => {

    let Main, Component, initialProps = {}
    const { assetPrefix, route, routes } = serverData

    routeLoader = new Loader(assetPrefix)

    window.__SWRN_LOADED_PAGE__.forEach(({ route, fn }) => {
        routeLoader.registerPage(route, fn)
    })
    delete window.__SWRN_LOADED_PAGE__

    window.__SWRN_REGISTER_PAGE__ = async (route, fn) => {
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

        console.log(2)

        initialProps = !Component.getInitialProps ? {} : await Component.getInitialProps()

        props.data = { ...initialProps, assetPrefix, route, routes }

        if (!!Main) {
            props.Component = Component
        } else {
            props.Main = Component
        }
        render(props)
    })
}

function render(props = {}) {
    ReactDOM.render(<App {...props} />, document.getElementById('root'))
}

