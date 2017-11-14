import { createElement } from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

export default function Render(Component, props) {

    const _Component = createElement(Component, props)

    const render = process.env.NODE_ENV !== 'production' ? renderToStaticMarkup : renderToString

    return render(createElement(StaticRouter, { context: {} }, _Component));

}