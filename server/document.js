import React from 'react'

class Main extends React.Component {
    render() {
        const { cssPath, jsPath, html, props} = this.props
        return (
            <html>
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                    <title>React同构开发Demo</title>
                    {cssPath.length ? cssPath.map((item,index) => { 
                        return <link rel="stylesheet" href={item} key={index}></link>
                    }) : null}
                </head>
                <div id="wrap" dangerouslySetInnerHTML={{ __html: html }}></div>
                <div id="data" data-state={JSON.stringify(props)}></div>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    module={}                    
                `}} />
                {jsPath.length ? jsPath.map((item,index) => { 
                    return <script src={item} key={index}></script>
                }) : null}
            </html>
        )
    }
}

export default Main