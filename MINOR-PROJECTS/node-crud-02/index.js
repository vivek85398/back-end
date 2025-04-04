const exprees = require('express')
const app = exprees()

const fs = require('fs')
const path = require('path')

app.set("view engine", "ejs")

app.use(exprees.json())
app.use(exprees.urlencoded({extended: true}))
app.use(exprees.static(path.join(__dirname, "public")))

app.get('/',function(req,res){
    fs.readdir(`./files`,function(err,files){
        res.render("index", {files: files})
    })
})

app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){  
        res.redirect("/")
    })
})

app.get('/file/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err,filedata){
        res.render('show', {filename: req.params.filename, filedata:filedata})
    })
})

app.get('/delete/:deleteFile',function(req,res){
    fs.unlink(`./files/${req.params.deleteFile}`, function(err){
        if(err) throw err;
        else res.redirect("/")
    })
})

app.get('/edit/:filename',function(req,res){
    res.render('edit', {filename: req.params.filename})
})

app.post('/edit',function(req,res){
    fs.rename(`./files/${req.body.PreviousFile}`, `./files/${req.body.newFile}`, function(err){
        res.redirect("/")
    })
})

app.listen(3000, ()=>{
    console.log('server is running on port 3000');
});