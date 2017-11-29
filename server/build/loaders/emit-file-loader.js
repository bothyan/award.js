import loaderUtils from 'loader-utils'

module.exports = function (content, sourceMap) {
  this.cacheable()

  const query = loaderUtils.getOptions(this)

  //当前解析的文件路径 和 当前文件的所在路径
  //console.log(this._module.issuer.resource)
  //console.log(this._module.resource)
  //console.log(this._module.userRequest)
  //console.log(this._module.rawRequest)

  const name = query.name || '[hash].[ext]'
  const context = query.context || this.options.context
  const regExp = query.regExp
  const opts = { context, content, regExp }
  const interpolatedName = loaderUtils.interpolateName(this, name, opts)

  /**
   * 
   * @param newcode 去除require引用css的部分代码，这里需要直接导出，交给node在服务端解析
   * @param oldcode babel-loader编译的代码，这里需要传给css进行解析
   */
  const emit = (newcode,oldcode, map) => {
    this.emitFile(interpolatedName, newcode, map)
    this.callback(null, oldcode, map)
  }

  if (query.transform) {
    const transformed = query.transform({ content, sourceMap, interpolatedName })
    return emit(transformed._content, transformed.content, transformed.sourceMap)
  }

  return emit(content, content, sourceMap)
}
