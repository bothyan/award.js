const { createElement } = require('react')
const { renderToString, renderToStaticMarkup} = require('react-dom/server')


module.exports = function Render(Component,props) { 

    return renderToStaticMarkup(createElement(Component,props));
    
}