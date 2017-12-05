import swrn from './'

swrn()
.catch((err) => {
    console.error(`${err.message}\n${err.stack}`)
})
