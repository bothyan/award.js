export default class CombineAssetsPlugin {
    constructor ({ input, output }) {
      this.input = input
      this.output = output
    }
  
    apply (compiler) {
      compiler.plugin('after-compile', (compilation, callback) => {
        let newSource = ''
        this.input.forEach((name) => {
          const asset = compilation.assets[name]
          if (!asset) return
  
          newSource += `${asset.source()}\n`
        })
  
        compilation.assets[this.output] = {
          source: () => newSource,
          size: () => newSource.length
        }
  
        callback()
      })
    }
  }
  