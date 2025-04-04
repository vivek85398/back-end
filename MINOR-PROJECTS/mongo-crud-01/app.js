const express = require('express');
const app = express();

const userModel = require('./models/user.model');
require('./config/config');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async(req, res)=>{
    const users = await userModel.find();
    res.render('index', {users});
});

app.get('/create', (req, res)=>{
    res.render('create');
});

app.post('/userCreate', async(req, res)=>{
    const {name, age, email} = req.body;
    await userModel.create({name, age, email});
    res.redirect('/');
});

app.get('/edit/:id', async(req,res)=>{
    const user = await userModel.findOne({_id: req.params.id});
    res.render('edit', {user});
});

app.post('/update/:userId', async(req, res)=>{
    let {name, age, email} = req.body;
    await userModel.findOneAndUpdate({_id: req.params.userId}, {name, age, email}, {new: true});
    res.redirect('/');
});

app.get('/delete/:Id', async(req, res)=>{
    await userModel.findOneAndDelete({_id: req.params.Id})
    res.redirect('/');
});

app.listen(3000, ()=>{
    console.log('server is running on port 3000');
});