const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const validator = require('validator');


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

/**
 * Static Function for Login
 * @param {*} email 
 * @param {*} password 
 */
userSchema.statics.login = async function (email,password){
    //Step 1 -- Checkers 
    if(!email || !password){
        throw Error('All Fields must be filled');
    }
    const exists = await this.findOne({email});
    if(!exists){
        throw Error('User does not exist');
    }

    //Step 2 -- Compare passwords, pass regular password
    //bcrypt hashes it and compares with the password
    const match = await bcrypt.compare(password,exists.password);

    if(!match){
        throw Error("Incorrect Password");
    }

    return exists;

}

/**
 * Static function for sign Up
 * @param {string} email 
 * @param {*string} password 
 */
userSchema.statics.signup = async function (email, password) {
    //Step 0 -- Null check
    if(!email || !password){
        throw Error('All Fields must be filled');
    }
    if(!validator.isEmail(email)){
        throw Error('Plase make sure you enter a valid email');
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password is not strong enough!');
    }
    //Step 1 -- Check if email exists, if it doesn't, return null value
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    }
    //step 2 -- Add salt and Hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //Step 3 --> Create Document for the user
    const user = await this.create({ email, password: hash });
    return user;
}
/**
 * Static Method for Deleting a User
 * @param {*string} email 
 */
userSchema.statics.deleteUser = async function (email) {
    //Step 1 -- Check for Empty String Email data
    if(!email){
        throw Error("Please enter a valid email");
    }
    
    if(!validator.isEmail(email)){
        throw Error('Please enter a valid email');
    }
    //Step 2 -- Find the User by email and delete it
    const exists = await this.findOne({email}); 
    if(!exists){
        throw Error("User Does not exists!");
    }
    const deletedUser = await this.deleteOne({'email':email});
    return deletedUser;
    
}

module.exports = mongoose.model('User', userSchema);