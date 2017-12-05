import 'react-hot-loader/patch'
import webpackHotMiddlewareClient from 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_swrn/webpack-hmr'

const swrn = window.swrn = require('./')

swrn.default()
.catch((err) => {
    console.error(`${err.message}\n${err.stack}`)
})