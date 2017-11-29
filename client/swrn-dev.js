import 'react-hot-loader/patch'
import webpackHotMiddlewareClient from 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_swrn/webpack-hmr'
import initSwrn from './'

initSwrn()
.catch((err) => {
    console.error(`${err.message}\n${err.stack}`)
})