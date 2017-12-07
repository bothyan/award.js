const React = require('react')
const ReactDom = require('react-dom/server')
const CSSModules = require('react-css-modules')


class Index extends React.Component {
    render() {

        const name = 'age'

        return (
            <div styleName={`${name} wrap`} className="kiki">
                <h1 styleName="name" className="hello">hello world</h1>
                <span styleName="hello wrap">孙杨杰</span>
            </div>
        )
    }
}

const cssm = CSSModules(Index, {
}, {
    allowMultiple: true,
    handleNotFoundStyleName:'ignore'    
})

console.log(React.createElement(Index))

const html = ReactDom.renderToString(React.createElement(cssm))

console.log(html)