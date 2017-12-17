import React, { Component, createElement } from 'react'
import ReactDOM from 'react-dom'
import extend from 'extend'
import App from '../lib/app'
import Loader from '../lib/loader'
import { createHeaderElements } from '../lib/utils'
import { changeHistory } from '../lib/router/utils'
import ErrorDebug from '../lib/error'

//获取服务器数据
const dataObj = document.getElementById('data')
const serverData = JSON.parse(dataObj.getAttribute("data-state"))
dataObj.remove()

export let routeLoader

const appContainer = document.getElementById('main')
const dev = process.env.NODE_ENV === 'development'

let Main = null

export default async () => {

    let Component
    const { assetPrefix, route, routes, error, to, query } = serverData

    routeLoader = new Loader(assetPrefix)

    window.__AWARD_LOADED_PAGE__.forEach(({ route, fn }) => {
        routeLoader.registerPage(route, fn)
    })
    delete window.__AWARD_LOADED_PAGE__

    window.__AWARD_REGISTER_PAGE__ = async (route, fn) => {
        routeLoader.registerPage(route, fn)
    }

    Main = await routeLoader.loadPage('/main.js')

    if (error.err) {
        Component = await routeLoader.loadPage(null)
    } else {
        // 首次加载页面 收集数据
        Component = await routeLoader.loadPage(route)
    }

    const data = { ...serverData }
    const props = { data, routeLoader }

    if (!!Main) {
        props.Main = Main
        props.Component = Component
    } else {
        props.Main = Component
    }

    console.log(serverData)

    error.err ? renderError({ error, to, query }) : renderHtml(props)

    // 路由切换页面加载
    routeLoader.subscribe(async ({ Component, route = null, query = {}, callback = null, to, error = {} }) => {

        if (typeof query === 'undefined') {
            return false
        }

        const props = await loadInitialProps({ Component, route, query, to, error })
        try {
            if (error.err) {
                //❌跳转到未知页面
                await renderError({ error, to, query })
            } else {
                renderHtml(props)
            }

        } catch (err) {
            //❌跳转到语法错误页面
            const error = {
                err: true,
                statusCode: 500,
                stack: err.stack,
                message: err.message
            }
            await renderError({ error, to, query })
        }

        //触发加载完成后回调
        if (callback != null) {
            callback()
        }
    })
}

export async function renderError({ error, to, query }) {

    const Component = await routeLoader.loadPage(null)

    const props = await loadInitialProps({ Component, route: '/_award_error', query, to, error })

    try {
        renderHtml(props)
    } catch (err) {
        //❌错误页面出现语法错误
        ReactDOM.render(createElement(ErrorDebug, { error: err }), appContainer)
    }
}

async function loadInitialProps({ Component, route, query, to, error }) {
    let initialProps = !Component.getInitialProps ? {} : await Component.getInitialProps({ query })
    const props = { routeLoader }
    const { assetPrefix, routes } = serverData

    if (!!Main) {
        //对象深拷贝
        const MainProps = !Main.getInitialProps ? {} : await Main.getInitialProps()
        initialProps = extend(true, MainProps, initialProps)

        props.Main = Main
        props.Component = Component
    } else {
        props.Main = Component
    }

    //删除所有award-head
    Array.from(document.getElementsByClassName('award-head')).map(item => {
        item.remove()
    })

    //创建新的award-head
    createHeaderElements(initialProps, createHeadElement)
    delete initialProps.header

    props.data = { ...initialProps, assetPrefix, route, routes, query, error, to }

    return props
}

function renderHtml(props = {}) {
    ReactDOM.render(createElement(App, props), appContainer)

    if (dev) {
        document.body.hidden = false
    }
}

function createHeadElement(element, obj) {
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
        createObj.setAttribute(key, obj[key])
    }

    if (!!children) {
        createObj.innerText = children
    }

    document.head.appendChild(createObj)
}

