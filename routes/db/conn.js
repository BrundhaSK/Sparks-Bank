const mongoose = require("mongoose");

const MONGODB_URI = 'mongodb+srv://brundhask:brundha2104@sparks-bank.fmep9.mongodb.net/test'
//create database
mongoose.connect(MONGODB_URI,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    keepAlive: true,
    useFindAndModify: false
}).then(() => {
    console.log("connection successful");
}).catch ((error) => {
    console.log(error);
});