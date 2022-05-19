const Course = require('../models/course');
const Enrol = require('../models/enrollment');
const cloudinary = require('../cloudinary');

module.exports = {
    getCourseById(req, res, next, id){
        Course.findById(id).exec((err, course) => {
            if(err) return res.status(400).json({err});
            req.course = course;
            next();
        });
    },

    // create a course (device)
    async create(req, res){
        req.body.programMode = req.body.programMode.split(',');
        req.body.programLanguage = req.body.programLanguage.split(',');
        const course = await new Course(req.body);
        
        if(req.file){
            course.image.url = req.file.path;            
        }

        course.save((err, course) => {
            if(err) return res.status(400).json({err});
            return res.json({message: 'Created a new device'});
        });
    },

    // getting all devices
    async courseIndex(req, res){
        const courses = await Course.find();
        return res.json(courses);
    },

    // get course by ID
    async getCourse(req, res){
        const course = await Course.findById(req.course._id);
        return res.json(course);
    },

    // update device 
    async courseUpdate(req, res){
        if(req.body.programLanguage || req.body.programMode){
            req.body.programMode = req.body.programMode.split(',');
            req.body.programLanguage = req.body.programLanguage.split(',');
        }
        
        const course = await req.course;
        course.name = req.body.name;
        course.helpLink = req.body.helpLink;
        course.learnMore = req.body.learnMore;
        course.type = req.body.type;
        course.manufactor = req.body.manufactor;
        course.defaultBaudRate = req.body.defaultBaudRate;
        course.description = req.body.description;
        course.bluetoothRequired = req.body.bluetoothRequired;
        course.featured = req.body.featured;
        course.disabled = req.body.disabled;
        course.useAutoScan = req.body.useAutoScan;
        course.serialPortalRequired = req.body.serialPortalRequired;
        course.initialConnectionRequired = req.body.initialConnectionRequired;
        course.launchPeripheralConnectionFlow = req.body.launchPeripheralConnectionFlow;
        // course.plugin = req.body.plugin;

        course.programMode = req.body.programMode;
        course.programLanguage = req.body.programLanguage;


        if(req.file) {
            course.image.data = req.file.path;
        }
        course.save((err, course) => {
            if(err) return res.status(400).json({err});
            return res.json({message: 'Device updated successfully'});
        });
    },

    // remove device
    async courseRemove(req, res) {
        const course = await req.course;
        const enrol = await Enrol.deleteMany({course: req.course});
        course.remove((err, course) => {
            if(err) return res.status(400).json({err});
            return res.json({message: 'Course removed successfully'});
        })
    },

    // get device image
    getCourseImage(req, res) {
        res.set('Content-Type', req.course.image.contentType);
        return res.send(req.course.image.data);
    }
}