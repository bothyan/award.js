const { createElement } = require('react')
const { renderToString, renderToStaticMarkup} = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')


module.exports = function Render(Component,props) { 

    const _Component = createElement(Component, props)
    
    const render = process.env.NODE_ENV !== 'production' ? renderToStaticMarkup : renderToString

    return render(createElement(StaticRouter, { context: {}},_Component));
    
}