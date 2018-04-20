const Express=require('express')
const app=Express()

app.use(express.static(__dirname+'/dist'))
app.listen(process.env.PORT||8080)
