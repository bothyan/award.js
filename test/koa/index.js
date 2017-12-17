const Koa = require('koa');
var router = require('koa-route'); 

const app = new Koa();


app.use(router.get('/:id',function(ctx,next){  
    let  id = ctx.params.id;  
    ctx.body = "your id is:"+id+", thank you !";  
}))

app.listen(5000);