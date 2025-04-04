const express = require('express');
const app = express();

const userModel = require('./models/user.model');
const postModel = require('./models/post.model');
const uploadProfile = require('./config/multer.config');
require('./config/config');

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const path = require('path');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render('index');
});

app.post("/register", async function(req, res){
    let {username, name, age, email, password} = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(400).send("User Already Registered");

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, async function(err, hash){
            let user = await userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            });
            let token = jwt.sign({email: email, userId: user._id}, "secret");
            res.cookie("token", token);
            res.redirect("/profile");
        })
    })
});

app.get('/login', (req, res)=>{
    res.render('login');
});

app.post('/login', async (req, res)=>{
    let {email, password} = req.body;

    let user = await userModel.findOne({email});
    if(!user) return res.status(400).send('Somthing went wrong');

    bcrypt.compare(password, user.password, (err, result) =>{
        if(result){
            let token = jwt.sign({email: email, userId: user._id}, "secret");
            res.cookie("token", token);
            res.status(200).redirect('/profile');
        }
        else res.redirect('/login');
    })
});

app.get('/logout', (req, res)=>{
    res.cookie('token', '');
    res.redirect('/login');
});

app.get('/profile', isloggedIn, async(req, res)=>{
    let user = await userModel.findOne({email: req.user.email}).populate("posts");
    res.render('profile', {user})
});

app.post('/post', isloggedIn, async(req, res)=>{
    let user = await userModel.findOne({email: req.user.email});
    let {content} = req.body;

    let post = await postModel.create({
        user: user._id,
        content
    })

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile")
});

app.get('/like/:id', isloggedIn, async(req, res)=>{
    let post = await postModel.findOne({_id: req.params.id}).populate("user");
    
    if(post.likes.indexOf(req.user.userId) === -1){
        post.likes.push(req.user.userId);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userId), 1);
    }
    await post.save();
    res.redirect("/profile");
});

app.get('/edit/:id', isloggedIn, async(req, res)=>{
    let post = await postModel.findOne({_id: req.params.id}).populate('user');
    res.render("edit", {post});
});

app.post('/update/:id', isloggedIn, async(req, res)=>{
    let post = await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content});
    res.redirect("/profile");
});

app.get('/delete/:postId', isloggedIn, async(req, res)=>{
    await postModel.findOneAndDelete({_id: req.params.postId});
    res.redirect('/profile')
})

app.get('/profile/changeProfile', (req, res)=>{
    res.render('profile-upload');
});

app.post('/profileUpload', isloggedIn, uploadProfile.single('image'), async(req, res)=>{
    let user = await userModel.findOne({email: req.user.email});
    user.profilePic = req.file.filename;
    await user.save();
    res.redirect('/profile');
});

function isloggedIn(req, res, next){
    if(req.cookies.token === '') res.redirect('/login');
    else{
        let data = jwt.verify(req.cookies.token, "secret");
        req.user = data;
        next();
    }
}

app.listen(3000, () => {
    console.log('Server running on port 3000')
});