require('dotenv').config();

const express = require('express')
// const expressLayout = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const session = require('express-session')
const MongoStore = require('connect-mongo')

const router = require('./server/routes/main')
const admin = require('./server/routes/admin')
const connectDB = require('./server/config/db')
const { isActiveRoute } = require('./server/helpers/routerHelpers');

const app = express()
const PORT = process.env.PORT || 5000

connectDB()
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));



//this middleware configuration sets up session handling using MongoDB as the storage backend, with some basic session options. The configuration ensures that sessions are managed efficiently and securely, though the commented-out cookie option indicates that you might want to customize session expiration further if needed.
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

//Templating Engine

// app.set('layout', './layouts/main') configures where to find the layout file.
// app.set('view engine', 'ejs') sets EJS as the template engine for rendering views in the application.
// app.use(expressLayout)
// app.set('layout','./layouts/main')
// app.set('view engine','ejs')

app.locals.isActiveRoute = isActiveRoute; 

// app.use('/',(req,res)=>{
//   res.json({message:"Connection success"})
// })
app.use('/admin', admin);
app.use('/route',router)

// app.get('/about',router)

app.listen(PORT,()=>console.log("App running on port ",PORT ))