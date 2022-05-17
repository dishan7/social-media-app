const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    age:{
        type:Number
    },
    phoneNumber:{
        type:String
    },
    confirmationCode:{
        type:String
    },
    status:{
        type:String,
        enum:['Active','Pending'],
        default:'Pending'
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.pre('save' , async function(next){
    if(!this.isModified('password')){
        return next;
    }
    else{
        this.password = await bcrypt.hash(this.password , 8);
    }
})

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id:user._id.toString() } , 'hereisthetoken');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async function(username , password){
    const User = await user.findOne({ username });
    if(!User){
        throw new Error('No user found');
    }

    const match = bcrypt.compare(password , User.password);
    if(match){
        return User;
    }
    else{
        return ("Wrong Password");
    }
}

const user = new mongoose.model('user' , userSchema);
module.exports = user;