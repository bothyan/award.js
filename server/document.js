import React from 'react'
import { createHeaderElements } from '../lib/utils'

class Main extends React.Component {

    constructor() {
        super()
        this.i = 0
        this.header = []
        this.createHeaderElement = this.createHeaderElement.bind(this)
    }

    createHeaderElement(key, obj = {}){
        let children = obj.children
        if (!!children == false) {
            if (key == 'title') {
                children = 'Award Demo'
            } else {
                children = null
            }
        } else {
            delete obj.children
        }
        obj.key = this.i
        obj.className = 'award-head'
        this.i++
        this.header.push(React.createElement(key, obj, children))
    }

    render() {
        const { cssPath, jsPath, html, props } = this.props

        createHeaderElements(props,this.createHeaderElement)        

        return (
            <html>
                <head>
                    {this.header}
                    {cssPath.length ? cssPath.map((item, index) => {
                        return <link rel="stylesheet" href={item} key={index}></link>
                    }) : null}
                </head>
                <div id="main" dangerouslySetInnerHTML={{ __html: html }}></div>
                <div id="data" data-state={JSON.stringify(props)}></div>
                <script dangerouslySetInnerHTML={{ __html: `module={};__AWARD_LOADED_PAGE__ = [];__AWARD_REGISTER_PAGE__ = function (route, fn) {__AWARD_LOADED_PAGE__.push({ route: route, fn: fn })};` }} />
                {jsPath.length ? jsPath.map((item, index) => {
                    return <script src={item.src} key={index} id={`__AWARD_PAGE__${item.route}`}></script>
                }) : null}
            </html>
        )
    }
}

export default Main