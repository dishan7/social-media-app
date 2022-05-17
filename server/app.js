const express = require('express');
const app = express();
const PORT = 5000;

const customMiddleware = ()=>{
    console.log("middleware executed!!");
}

const mongoose = require('mongoose');
const signup = require('./src/routes/signUp');
const login = require('./src/routes/login');

mongoose.connect('mongodb://localhost:27017/social-media-app',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.once('open' , ()=>{
    console.log('connected successfully');
});


// app.use(customMiddleware);

app.use(express.json());

app.get('/home' , (req , res)=>{
    res.send('hello world');
})
app.use(signup)
app.use(login)

app.listen(PORT , ()=>{
    console.log(`app is listening on port ${PORT}`);
})