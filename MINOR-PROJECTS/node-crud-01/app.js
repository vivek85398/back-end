const express = require("express");
const app = express();

const fs = require("fs");

app.set("view engine", "ejs");

app.get("/", function(req, res){
    fs.readdir(`./uploads`, {withFileTypes: true}, function(err,files){
        res.render("index", {files});
    })
})

app.get("/create", function(req, res){
    res.render("create")
})

app.get("/new", function(req,res){
    fs.writeFile(`./uploads/${req.query.filename}`, req.query.filedata, function(err){
        if(err) throw err;
        else res.redirect("/")
    })
})

app.get("/show/:filename", function(req,res){
    fs.readFile(`./uploads/${req.params.filename}`, "utf-8", function(err,data){
        res.render('read', {data});
    })
})

app.get("/edit/:filename",function(req,res){
    const editName = req.params.filename
    fs.readFile(`./uploads/${req.params.filename}`,"utf-8",function(err,data){
        res.render("edit",{filename:editName,filedata:data});
    })
})

app.get("/editNote/:oldfile",function(req,res){
    const newFilename = req.query.filename
    const newFiledata = req.query.filedata

    fs.rename(`./uploads/${req.params.oldfile}`, `./uploads/${newFilename}`, function(err){
        fs.writeFile(`./uploads/${newFilename}`, newFiledata,function(err){
            res.redirect("/")
        })
    })
})

app.get("/delete/:deleteNote", function(req,res){
    fs.unlink(`./uploads/${req.params.deleteNote}`, function(err){
        if(err) throw err;
        else res.redirect("/")
    })
})

app.listen(3000, ()=>{
    console.log('server is running on port 3000');
    
})