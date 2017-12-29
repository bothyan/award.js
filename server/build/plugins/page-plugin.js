import getConfig from '../../config'

export default class PagesPlugin {
    apply(compiler) {
        compiler.plugin('after-compile', (compilation, callback) => {

            const { page } = getConfig(compilation.options.context)

            const IS_BUNDLED_PAGE = new RegExp(`^bundles[/\](${page}.*.js|main.js|error.js)$`)
            const MATCH_ROUTE_NAME = new RegExp(`^bundles[/\](${page}[/\](.*).js|main.js|error.js)$`)

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

                routeName = routeName == '/error.js' ? '/_award_error' : routeName

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
