import initSwrn from './'

initSwrn()
.catch((err) => {
    console.error(`${err.message}\n${err.stack}`)
})
