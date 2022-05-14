const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    school: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    student: {
        type: Boolean,
        default: false
    },
    
    schoolName: {
        type: String
    },
    gender: {
        type: String
    
    },
    dateOfBirth: {
        type: String,
    },
    grade: {
        type: String
    },
    city: {
        type: String,
        
    },
    phone: {
        type: String
    },
    nameOfParent: {
        type: String
    },
    parentEmail: {
        type: String,
    },
    parentPhone: {
        type: String,
    },
    address: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    data: {
        
    },
    status: {
		type: String,
		default: 'Not purchased',
		enum: ['Not purchased', 'Purchased', 'Cancelled']
	}
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);
