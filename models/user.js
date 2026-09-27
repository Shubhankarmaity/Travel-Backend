const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        require:true
    }
});

userSchema.plugin(passportLocalMongoose);//the user name or password is already created by the mongoose password local by default

module.exports=mongoose.model('User',userSchema);
