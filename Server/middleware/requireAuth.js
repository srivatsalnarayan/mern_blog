const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
/**
 * 
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next middleware
 */
const requireAuth = async (req, res, next) => {
    //Step 1 --> Verify Auth
    const { authorization } = req.headers;
    //Step 2 --> Check if there is no authorization
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }
    // [Bearer, asdasdaas]
    const token = authorization.split(" ")[1];
    //Step 3 --> Verify token
    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        req.user = await User.findOne({ _id }).select('_id');
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).error({ error: "Request is not authorized" });
    }

}

module.exports = requireAuth;