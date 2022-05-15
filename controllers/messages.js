const Message = require('../models/message');

module.exports = {
    getMessageById(req, res, next, id){
        Message.findById(id).exec((err, message) => {
            if(err) return res.status(400).json({err});
            req.message = message;
            next();
        });
    },

    async create(req, res){
        const message = await new Message(req.body);

        message.save((err, message) => {
            if(err) return res.status(400).json({err});
            return res.json({message: 'Message sent successfully! Check your email for reponse.'});
        });
    },

    async index(req, res){
        const messages = await Message.find().sort('-createdAt');
        return res.json(messages);
    },

    async getUnreadMessages(req, res){
        const messages = await Message.find({read: false});
        return res.json(messages);
    },

    async getMessage(req, res){
        const message = await req.message;
        return res.json(message);
    },

    async updateReadMessage(req, res, next){
        const message = await Message.findOneAndUpdate({_id: req.message._id}, {read: req.body.read}, {new: true});
        // message.read = await req.body.read;
        message.save((err, message) => {
            if(err) return res.status(400).json({err});
            return res.json(message);
        });
    }
}