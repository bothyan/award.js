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
  const resource = this._module.resource

  const emit = (code, map, writeCode) => {
    writeCode = typeof writeCode != 'undefined' ? writeCode : code
    this.emitFile(interpolatedName, writeCode , map)
    this.callback(null, code, map)
  }

  if (query.transform) {
    const transformed = query.transform({ content, sourceMap, interpolatedName, resource })
    return emit(transformed.content, transformed.sourceMap, transformed._content)
  }

  return emit(content, sourceMap, content)
}
