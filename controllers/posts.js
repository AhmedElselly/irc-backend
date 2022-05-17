const Post = require('../models/post');
const User = require('../models/user');
const {Buffer} = require('buffer');

module.exports = {
    getPostById(req, res, next, id) {
        Post.findById(id).populate('user').exec((err, post) => {
            if(err) return res.status(400).json({err});
            req.post = post;
            next();
        });
    },
    async create(req, res) {
        try {
            // console.log(req.body);
            if(req.body.data) {
                for(let item of req.body.data) {
                    const user = await User.findOne({name: item.name});
                    if(!user) return res.status(400).json({error: `${item.name} is not found in database!`});
                    user.data = item;
                    // console.log(student)
                    user.save();
                }
            }
            const posts = await Post.find();
            return res.json({message: 'added all data'});
        } catch(err) {
            console.log(err);
        }
    },

    async getPost(req, res) {
        const post = await Post.find(req.post._id)
            .populate('user')
            .select('-image');
        return res.json(post);
    },

    async createImage(req, res){
        const post = await new Post(req.body);
        // const image = Buffer.from(req.body.image, 'utf8');
        // post.image.data = await image.toString('base64');
        // post.image.contentType = 'image/jpeg';

        if(req.file){
            post.image.data = req.file.buffer;
            post.image.contentType = 'image/png';
        }
        
        post.user = req.user;
        post.save((err, post) => {
            if(err) return res.status(400).json({error: 'something went wrong'});
            return res.json({message: 'Image sent successfully!'});
        })
    },

    async getStudentPosts(req, res){
        const posts = await Post.find({user: req.user})
            .sort({'_id': -1})
            .populate('user')
            .select('-image');
        return res.json(posts);
    },

    getPostImage(req, res){
        res.set('Content-Type', req.post.image.contentType);
        return res.send(req.post.image.data);
    },

    async allPosts(req, res){
        const posts = await Post.distinct('user');
            
        const users = await User.find({_id: {$in: posts}});
        return res.json(users);
    }
}