const { createElement } = require('react')
const { renderToString, renderToStaticMarkup} = require('react-dom/server')
const { StaticRouter } = require('react-router')


module.exports = function Render(Component,props) { 

    const _Component = createElement(Component,props)

    return renderToString(createElement(StaticRouter, { context: {}},_Component));
    
}