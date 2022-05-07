const mongoose = require('mongoose');
const {Schema} = mongoose;

const messageSchema = new Schema({
    text: {
        type: String, 
        required: true
    },
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);