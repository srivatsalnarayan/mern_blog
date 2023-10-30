
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

/**
 * Creates JWT Token
 * @param {*} _id 
 */
const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '1d'});
}

/**
 * Login Controller
 * @param {*} req 
 * @param {*} res 
 */
const loginUser = async (req, res) => {
    const {email,password} = req.body;
    //Step 2 -- Comparing passwords
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.status(200).json({email, token})
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
    
}
/**
 * Sign Up 
 * @param {*} req 
 * @param {*} res 
 */
const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.signup(email, password);
        //Create Token
        const token = createToken(user._id);

        res.status(201).json({ email, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Delete account
 * @param {*} req 
 * @param {*} res 
 */
const deleteAccount = async (req, res) => {
    const  {email}  = req.query;
    try {
        const user = await User.deleteUser(email);
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    signupUser,
    loginUser,
    deleteAccount
}