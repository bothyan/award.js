const React = require('react')
const ReactDom = require('react-dom/server')
const className = []

class Index extends React.Component { 
    render() { 
        return (
            <div className="age wraps">
                <h1 className="name">hello world</h1>       
                <div className="input">
                    <span className="book">
                        <b className="tips"></b>
                    </span>
                    <a className="line"></a>
                </div>
                <span className="line"></span>
            </div> 
        )    
    }
}

class Mine extends Index { 
    render() { 
        const result = super.render()
        linkClass(result.props)
        console.log(className)
        return result
    }
}


let i = 0

const linkClass = (Component) => { 
    
    className[i] = (className[0] || '') + ' ' + Component.className

    if (typeof Component.children === 'object') {
        if (Component.children.length) {
            i++
            Component.children.map(item => {
                linkClass(item.props)
            })
        } else {
            linkClass(Component.children.props)
        }    
    }
}

const _c = React.createElement(Mine)

const _d = React.Children.only(_c)

const html = ReactDom.renderToString(_c)

console.log(html)