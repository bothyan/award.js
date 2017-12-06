import award from './'

award()
.catch((err) => {
    console.error(`${err.message}\n${err.stack}`)
})
