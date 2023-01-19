const express= require('express')
const app= new express()
app.use(express.static('public'))
const ejs= require('ejs')

let port=process.env.PORT;
if(port==null || port==""){
    port=4000;
}

const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://saurabhiitism:Pass@cluster0.ezlmdrf.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true})
mongoose.connect('mongodb+srv://saurabh:pass@cluster0.rvxisbo.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true})
app.set('view engine','ejs')

const bodyParser=require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


const fileUpload=require('express-fileupload')
app.use(fileUpload())

const validateMiddleWare=require('./middleware/validationMiddleware')
app.use('/posts/store',validateMiddleWare)

const expressSession=require('express-session');
app.use(expressSession({
    secret:'keyboard cat'
}))

const authMiddleware=require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware=require('./middleware/redirectIfAuthenticatedMiddleware')

global.loggedIn=null;
app.use("*",(req,res,next)=>{
    loggedIn=req.session.userId;
    next()
})

const flash=require('connect-flash');
app.use(flash());

const homeController=require('./controllers/home')
app.get('/',homeController)

const getPostController=require('./controllers/getPost')
app.get('/post/:id',getPostController)

const newPostController=require('./controllers/newPost')
app.get('/posts/new',authMiddleware,newPostController)

const storePostController=require('./controllers/storePost')
app.post('/posts/store',authMiddleware,storePostController)

const newUserController=require('./controllers/newUser')
app.get('/auth/register',redirectIfAuthenticatedMiddleware,newUserController)

const storeUserController=require('./controllers/storeUser')
app.post('/users/register',redirectIfAuthenticatedMiddleware,storeUserController)

const loginController=require('./controllers/login')
app.get('/auth/login',redirectIfAuthenticatedMiddleware,loginController);

const loginUserController=require('./controllers/loginUser')
app.post('/users/login',redirectIfAuthenticatedMiddleware,loginUserController)

const logoutController=require('./controllers/logout')
app.get('/auth/logout',logoutController)

app.use((req,res)=>res.render('notFound'));

app.listen(port,()=>{
    console.log('Saurabh-blog App listening')
})