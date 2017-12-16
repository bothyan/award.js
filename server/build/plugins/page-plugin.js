const IS_BUNDLED_PAGE = /^bundles[/\\](pages.*\.js|main|error\.js)$/
const MATCH_ROUTE_NAME = /^bundles[/\\](pages[/\\](.*)\.js|main|error\.js)$/

export default class PagesPlugin {
    apply(compiler) {
        compiler.plugin('after-compile', (compilation, callback) => {
            const pages = Object
                .keys(compilation.namedChunks)
                .map(key => compilation.namedChunks[key])
                .filter(chunk => IS_BUNDLED_PAGE.test(chunk.name))

            pages.forEach((chunk) => {
                const page = compilation.assets[chunk.name]
                const pageName = MATCH_ROUTE_NAME.exec(chunk.name)[1]
                let routeName = pageName

                if (/^win/.test(process.platform)) {
                    routeName = routeName.replace(/\\/g, '/')
                }

                routeName = `/${routeName.replace(/(^|\/)index$/, '')}`

                const content = page.source()
                const newContent = `window.__AWARD_REGISTER_PAGE__('${routeName}', function(){var comp = ${content};return comp.default})`     
                
                compilation.assets[chunk.name] = {
                    source: () => newContent,
                    size: () => newContent.length
                }
            })
            callback()
        })
    }
}
