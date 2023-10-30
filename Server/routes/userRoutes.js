
const express = require('express');
const {signupUser,loginUser, deleteAccount } = require("../controllers/userController");

const router = express.Router();

//Login
router.post('/login',loginUser);
//Signup
router.post('/signup',signupUser);

//Delete
router.delete('/deleteAccount',deleteAccount);
module.exports = router;