const mongoose = require('mongoose');
const {Schema} = mongoose;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // image: {
    //     data: Buffer,
    //     contentType: String
    // },
    image: {
        url: String,
    },
    description: {
        type: String,
        required: true
    },
    bluetoothRequired: {
        type: Boolean,
        default: false
    },
    serialPortalRequired: {
        type: Boolean,
        default: false
    },
    initialConnectionRequired: {
        type: Boolean,
        default: false
    },
    launchPeripheralConnectionFlow: {
        type: Boolean,
        default: false
    },
    useAutoScan: {
        type: Boolean,
        default: false
    },
    defaultBaudRate: {
        type: String,
    },
    featured: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    manufactor: {
        type: String,
        required: true
    },
    programMode: [{
        type: String,
        required: true
    }],
    programLanguage: {
        type: Array,
        required: true
    },
    tags: {
        type: Array,
        // required: true
    },
    helpLink: {
        type: String,
        required: true
    },
    
    learnMore: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
