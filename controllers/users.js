const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    getUserById(req, res, next, id){
		User.findById(id).exec(function(err, user){
			if(err) return res.status({error: 'No user with that ID'});
			req.user = user;
			next();
		});
	},

    async register(req, res) {
       
        const user = new User(req.body);

        await user.setPassword(req.body.password);

        user.save((err, user) => {
            console.log(err)
            if(err) return res.json(400).json({err});
            return res.json(user);
        })
    },

    async login(req, res) {
                
        const {err, user} = await User.authenticate()(req.body.email, req.body.password);
        
        if(err || !user) return res.status(501).json({error: 'email and password do not match!'});
        const {_id, email, username} = user;
        const token = await jwt.sign({_id, email, username}, process.env.SECRETKEY);

        return res.json({token, user});
    },

    async checkUserPurchase(req, res, next){
        const user = await User.findOne({email: req.body.email});
        if(user.status === 'Purchased'){
            next();
        } else {
            return res.status(400).json({error: 'Need to purchase to login! Please send a message to support'});
        }
    },

    async foundUser(req, res, next) {
        const foundUser = await User.findOne({email: req.body.email});
        if(foundUser) return res.status(400).json({error: 'User with that email already exist!'});
        next();
    },

    async addNewUser(req, res){
        console.log(req.body)
      

        const user = await new User(req.body);
        if(req.body.role === 'student'){
            user.student = true;
        }
        if(req.body.role === 'school'){
            user.school = true;
        }
        if(req.body.role === 'admin'){
            user.admin = true;
        }
        if(req.file) {
            user.image.data = req.file.buffer;
            user.image.contentType = req.file.mimetype;
        }
        await user.setPassword(req.body.password);
        console.log('user', user)
        user.save((err, user) => {
            if(err) return res.status(400).json({err});
            return res.json({message: 'User successfully added!'});
        })
        
    },

    async getUsers(req, res){
        const users = await User.find();
        return res.json(users);
    },

    async getStudents(req, res){
        const users = await User.find({student: true});
        return res.json(users);
    },

    async getSchools(req, res){
        const users = await User.find({school: true});
        return res.json(users);
    },

    async getUser(req, res){
        const user = await User.findById(req.params._id);
        console.log(user)
        return res.json(user);
    },

    async updateStudent(req, res){
        const user = await User.findById(req.params._id);
        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.gender = req.body.gender;
        user.schoolName = req.body.schoolName;
        user.dateOfBirth = req.body.dateOfBirth;
        user.grade = req.body.grade;
        user.city = req.body.city;
        user.nameOfParent = req.body.nameOfParent;
        user.parentEmail = req.body.parentEmail;
        user.parentPhone = req.body.parentPhone;
        user.address = req.body.address;

        if(req.body.role === 'student'){
            user.student = true;
        }
        if(req.body.role === 'school'){
            user.school = true;
        }
        if(req.body.role === 'admin'){
            user.admin = true;
        }

        if(req.file){
            user.image.data = req.file.buffer;
            user.image.contentType = req.file.mimetype;
        }

        console.log(user)


        user.save((err, user) => {
            if(err) return res.status(401).json({err});
            return res.json(user);
        });        
    },

    async getUserStatus(req, res){
		const statuses = await User.schema.path('status').enumValues;
        // console.log(statuses)
		return res.json(statuses);
    },

    async updateUserStatus(req, res) {
        const user = await User.findOneAndUpdate({'_id': req.user._id}, {status: req.body.status});
       
        user.save((err, user) => {
            if(err) return res.status(401).json({err});
            return res.json(user);
        });
    }
}