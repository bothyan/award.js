import React, { createElement } from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import send from 'send'
import extend from 'extend'
import { resolve, join } from 'path'
import glob from 'glob-promise'
import App from '../../lib/app'
import Document from './document'
import ErrorDebug from '../../lib/error'

export default function render(Component, props) {
  return renderToStaticMarkup(createElement(Component, props))
}

export function serveStatic(req, res, path) {
  return new Promise((resolve, reject) => {
    send(req, path)
      .on('directory', () => {
        // We don't allow directories to be read.
        const err = new Error('No directory access')
        err.code = 'ENOENT'
        reject(err)
      })
      .on('error', reject)
      .pipe(res)
      .on('finish', resolve)
  })
}

//渲染正确的页面
export async function renderHtml({ req, res, error, page, routes, Component, Main, dev, dir, dist, assetPrefix, exist_maincss }) {

  const query = { ...req.params, ...req.query }
  const to = req.url
  const initialProps = !Component.getInitialProps ? {} : await Component.getInitialProps({ req, res, query })

  let html, _Component, props = { ...initialProps, route: page, query, routes, error, to }


  if (Main) {
    //对象深拷贝
    const MainProps = !Main.getInitialProps ? {} : await Main.getInitialProps({ req, res })
    props = extend(true, MainProps, { ...props, Component, Main })
    _Component = createElement(App, props)

  } else {
    _Component = createElement(Component, props)
  }
  
  if (error.err) {
    renderToString(createElement(Component, props))
  }
    
  html = renderToStaticMarkup(_Component)

  //css、js资源地址配置
  let cssPath = []
  let jsPath = [] //主要依赖的文件，也就是客户端入口

  //客户端路由自定义配置页面
  if (Main) {
    jsPath.push({
      route: '/main.js',
      src: join(assetPrefix, 'static/main.js')
    })
  }

  if (!error.err) { 
    jsPath.push({
      route: page,
      src: join(assetPrefix, page)
    })
  }

  //当前页面需要的js文件
  jsPath.push({
    route: '/_award_error',
    src: join(assetPrefix, '/static/error.js')
  },{
    route: '',
    src: join(assetPrefix, '/main.js')
  })

  //判断是否有css，一个是当前页面 一个是公共的
  const _cssPath = await glob(join(dir, dist, 'static/style/bundles', page + '.css'))

  if (exist_maincss.length) {
    cssPath.push(`${assetPrefix}/static/style/main.css`)
  }

  if (_cssPath.length) {
    cssPath.push(`${assetPrefix}/static/style${page.split('.')[0]}.css`)
  }

  props.assetPrefix = assetPrefix

  _Component = createElement(Document,{
    jsPath,
    cssPath,
    props,
    html,
    dev
  })
   
  return '<!DOCTYPE html>' + renderToStaticMarkup(_Component)   
}

//渲染错误页面
export async function renderError({ req, res, error, routes, dev, dir, dist, exist_mainjs, exist_maincss, assetPrefix }) { 
  const html = render(ErrorDebug, { error })

  const query = { ...req.params, ...req.query }
  const to = req.url

  const props = { route: '/_error_error', query, routes, to, _error:error }
  
  //css、js资源地址配置
  let cssPath = []
  let jsPath = [] //主要依赖的文件，也就是客户端入口

  //客户端路由自定义配置页面
  if (exist_mainjs.length) {
    jsPath.push({
      route: '/main.js',
      src: join(assetPrefix, 'static/main.js')
    })
  }

  //当前页面需要的js文件
  jsPath.push({
    route: '',
    src: join(assetPrefix, '/main.js')
  })

  props.assetPrefix = assetPrefix

  const _Component = createElement(Document,{
    jsPath,
    cssPath,
    props,
    html,
    dev
  })

  res.status(error.statusCode).send('<!DOCTYPE html>' + renderToStaticMarkup(_Component))
}