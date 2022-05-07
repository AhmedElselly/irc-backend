const mongoose = require('mongoose');
const {Schema} = mongoose;

const enrollmentSchema = new Schema({
	course: {
		type: Schema.Types.ObjectId,
		ref: 'Course'
	},

	student: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	enrolledAt: {
		type: Date,
		default: Date.now
	},

	completed: Date,
	
}, {
    timestamps: true
});

module.exports = mongoose.model('Enrol', enrollmentSchema);