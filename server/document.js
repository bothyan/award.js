import React from 'react'

class Main extends React.Component { 
    render() { 
        const { html, comProps, sourcePath, page } = this.props
        return (
            <html>
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
                    <title>React同构开发Demo</title>
                    <link rel="stylesheet" href="//at.alicdn.com/t/font_62vouh9aajug14i.css" />                    
                    <link rel="stylesheet" type="text/css" href={`${sourcePath}style/app.css`} />
                </head>
                <div id="wrap" dangerouslySetInnerHTML={{__html:html}}></div>
                <div id="data" data-state={JSON.stringify(comProps)}></div>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    module={}
                    __NEXT_PAGE = []
                    window.__NEXT_REGISTER_PAGE = function (route,fn) {
                        __NEXT_PAGE.push(fn())
                    }
                `}} />
                <script src={`${sourcePath}main.js`}></script>
                <script src={`${sourcePath}${page}`}></script>                
            </html>
        )
    }
}

export default Main