const jwt = require('jsonwebtoken');
const {check} = require('express-validator');

module.exports = {
    isAuth(req, res, next){
        try{
            const token = req.headers['authorization'].split(' ')[1];
            console.log(token);
            const user = jwt.verify(token, process.env.SECRETKEY);
            if(user){
                next();
            } else {
                return res.status(400).json({error: "Should be logged in to submit!"});
            }
        } catch(err){
            return res.status(400).json({error: "Should be logged in to submit!"});
        }
    },

    isAdmin(req, res, next){
        if(req.user.admin){
            next();
        } 
        if(!req.user.admin) {
            return res.status(400).json({error: 'User is not admin!'})
        }
    }
}