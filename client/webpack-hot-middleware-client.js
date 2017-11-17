import webpackHotMiddlewareClient from 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_swrn/webpack-hmr'
webpackHotMiddlewareClient.subscribe((obj) => {
    console.log(obj)
    // const fn = handlers[obj.action]
    // if (fn) {
    //   const data = obj.data || []
    //   fn(...data)
    // } else {
    //   throw new Error('Unexpected action ' + obj.action)
    // }
  })