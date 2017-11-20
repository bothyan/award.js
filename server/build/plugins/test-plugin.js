const IS_BUNDLED_PAGE = /\.scss$/

export default class PagesPlugin {
    apply(compiler) {
        compiler.plugin('after-compile', (compilation, callback) => {
            const pages = Object
                .keys(compilation.namedChunks)
                .map(key => compilation.namedChunks[key])
                .filter(chunk => IS_BUNDLED_PAGE.test(chunk.name))
            
            //console.log(compilation.namedChunks)

        //     pages.forEach((chunk) => {
        //         const page = compilation.assets[chunk.name]
        //         const pageName = MATCH_ROUTE_NAME.exec(chunk.name)[1]
        //         let routeName = pageName

        //         // We need to convert \ into / when we are in windows
        //         // to get the proper route name
        //         // Here we need to do windows check because it's possible
        //         // to have "\" in the filename in unix.
        //         // Anyway if someone did that, he'll be having issues here.
        //         // But that's something we cannot avoid.
        //         if (/^win/.test(process.platform)) {
        //             routeName = routeName.replace(/\\/g, '/')
        //         }

        //         routeName = `/${routeName.replace(/(^|\/)index$/, '')}`

        //         const content = page.source()
        //         const newContent = `
        //     window.__SWRN_REGISTER_PAGE__('${routeName}', function() {
        //       var comp = ${content}
        //       return comp.default
        //     })
        //   `
        //     // Replace the exisiting chunk with the new content
        //         compilation.assets[chunk.name] = {
        //             source: () => newContent,
        //             size: () => newContent.length
        //         }
        //     })
            callback()
        })
    }
}
