const Enrol = require('../models/enrollment');
const User = require('../models/user');

module.exports = {
    getEnrollmentById(req, res, next, id){
		Enrol.findById(id)
		.populate('student')
		.populate('course')
		// .populate({path: 'course', populate: {path: 'lessons'}})
		.exec((err, enrol) => {
			if(err) return res.status(400).json({error: 'Could not find enrollment for this ID'});
			req.enrol = enrol;
			// req.enrol.course.image = undefined;
			// req.enrol.course.instructor.password = undefined;
			next();
		});
	},

    async create(req, res) {
		const student = await User.findOne({email: req.body.email});
		if(!student) return res.status(400).json({error: 'No such student with such email found!'});
		const foundEnrolled = await Enrol.findOne({course: req.course,student: student._id});
		console.log('found enrollment', foundEnrolled)
		if(foundEnrolled) return res.status(400).json({error: 'User already enrolled into that course!'});
        const enrol = await new Enrol(req.body);
        enrol.course = await req.course;
        enrol.student = await student._id;

        enrol.save((err, enrol) => {
            if(err) return res.status(400).json({err});
            return res.json(enrol);
        })
    },

    async read(req, res){
		const enrol = await Enrol.findOne({student: req.user._id})
		.populate('student', '-image')
		.populate('course', '-image')
		// enrol.course.image = undefined;
		return res.json(enrol);
	},
    
    async findEnrollment(req, res, next){
		console.log(req.user);
		const user = await req.user;
		if(!user || user === 'null') return res.json({message: "please logout and signin again"});
		const found = await Enrol.find({course: req.course._id, student: req.user._id});
		console.log('findEnrollment', found)
		if(!found.length){
			return res.json({message: "You haven't enrolled to this course yet!"});
		} else {
			next();
		}
	},

    async listByStudent(req, res){
		const enrol = await Enrol.find({'student': req.user._id})
			.populate('course');
		return res.json(enrol);
	},

	async removeEnrol(req, res){
		const enrol = await req.enrol;
		enrol.remove((err, enrol) => {
			if(err) return res.status(400).json({err});
			return res.json({message: 'Removed enrollment successfully'});
		})
	}
}