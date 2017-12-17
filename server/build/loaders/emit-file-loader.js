import loaderUtils from 'loader-utils'

module.exports = function (content, sourceMap) {
  this.cacheable()
  
  const query = loaderUtils.getOptions(this)

  const name = query.name || '[hash].[ext]'
  const context = query.context || this.options.context
  const regExp = query.regExp
  const opts = { context, content, regExp }
  const interpolatedName = loaderUtils.interpolateName(this, name, opts)
  const resource = this._module.resource

  const emit = (code, map, writeCode) => {
    writeCode = typeof writeCode != 'undefined' ? writeCode : code
    this.emitFile(interpolatedName, writeCode , false)
    this.callback(null, code, false)
  }

  if (query.transform) {
    /**
     * content : callback
     * _content : emitFile
     */
    const transformed = query.transform({ content, sourceMap, interpolatedName, resource })
    return emit(transformed.content, transformed.sourceMap, transformed._content)
  }

  return emit(content, sourceMap, content)
}
