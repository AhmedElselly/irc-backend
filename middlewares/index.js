module.exports = {
    isAdmin(req, res, next){
        if(req.user.admin){
            next();
        } 
        if(!req.user.admin) {
            return res.status(400).json({error: 'User is not admin!'})
        }
    }
}