const express = require('express')

const app = express()

app.get('/', async (req, res) => { 
    console.log(1)
    await Home(res)
    console.log(2)
    //res.send(HomeHtml)
})

app.get('/about', async (req, res) => { 
    console.log(1)
    await Home(res)
    console.log(2)
    //res.send(HomeHtml)
})

app.get('*', async (req, res) => { 
    console.log(3)
    res.send('找不到页面')
})

const Home = (res) => { 
    return new Promise((resolve, reject) => { 
        setTimeout(() => { 
            resolve('首页')
        },3000)
    }).then((html) => { 
        res.send(html)
    })
}

app.listen(5000, () => { 
    console.log('::5000')
})