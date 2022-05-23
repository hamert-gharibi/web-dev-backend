const Joi = require('joi');


// validating registration
const registerValidation = (data) => {
    const schema = Joi.object( 
        {
            name: Joi.string().min(6).max(255).required(),
            email: Joi.string().min(6).max(255).required(),
            password: Joi.string().min(6).max(255).required()    
        });
        return schema.validate(data);
}

// validating login
 const loginValidation = (data) => {
     const schema = Joi.object(
         {
            email: Joi.string().min(6).max(255).required(),
            password: Joi.string().min(6).max(255).required()                 
         });
         return schema.validate(data);
 }

// login to verify our token (JWT)
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");

    //if there is no token in the request, then fail
    if (!token) return res.status(401).json({ error: "Access Denied" });

    //check the token...
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();        
    } catch (error) {
        res.status(400).json({ error: "Token is not valid"});
    }
}

module.exports = { registerValidation, loginValidation, verifyToken };