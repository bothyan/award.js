import 'react-hot-loader/patch'
import webpackHotMiddlewareClient from 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_award/webpack-hmr'

const award = window.award = require('./')

award.default()
.catch((err) => {
    console.error(`${err.message}\n${err.stack}`)
})