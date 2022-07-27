require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const bodyParser = require('body-parser');

mongoose.connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the DB!');
});

// ROUTES IMPORTS
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const enrollmentRoutes = require('./routes/enrollments');

// SETTING
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:3000', 'http://164.92.145.200']
}));
app.use(helmet());
app.use(session({
    resave: true,
    secret: 'school is awesome',
    saveUninitialized: false
}));

// Passport initialization for user authentication (Login/Signup)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Basic api routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

// Server listening
app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`);
});