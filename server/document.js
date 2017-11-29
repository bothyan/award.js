import React from 'react'

class Main extends React.Component {
    render() {
        const { html, props, mainBundle ,mainPath,jsPath, cssPath, } = this.props
        return (
            <html>
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                    <title>React同构开发Demo</title>
                    <link rel="stylesheet" href="//at.alicdn.com/t/font_62vouh9aajug14i.css" />
                    {cssPath ? <link rel="stylesheet" href={cssPath} /> : null}
                </head>
                <div id="wrap" dangerouslySetInnerHTML={{ __html: html }}></div>
                <div id="data" data-state={JSON.stringify(props)}></div>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    module={}                    
                `}} />
                <script src={mainPath}></script>
                {mainBundle ? <script src={mainBundle}></script> : null}
                <script src={jsPath}></script>
            </html>
        )
    }
}

export default Main