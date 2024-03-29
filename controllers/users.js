const User = require("../models/user");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

module.exports = {
  getUserById(req, res, next, id) {
    User.findById(id).exec(function (err, user) {
      if (err) return res.status({ error: "No user with that ID" });
      req.user = user;
      next();
    });
  },

  async register(req, res) {
    const user = new User(req.body);

    await user.setPassword(req.body.password);

    user.save((err, user) => {
      if (err) return res.json(400).json({ err });
      return res.json(user);
    });
  },

  async login(req, res) {
    const { err, user } = await User.authenticate()(
      req.body.email,
      req.body.password
    );

    if (err || !user)
      return res
        .status(400)
        .json({ error: "email and password do not match!" });
    const { _id, email, username } = user;
    const token = await jwt.sign(
      { _id, email, username },
      process.env.SECRETKEY
    );
    const loggedInUser = await User.findById(user._id).select("-image");
    return res.json({ token, user: loggedInUser });
  },

  async checkUserPurchase(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user === "null")
      return res.status(400).json({ error: "User with that email not found!" });
    if (user.status === "Purchased") {
      next();
    } else {
      return res
        .status(400)
        .json({
          error: "Need to purchase to login! Please send a message to support",
        });
    }
  },

  async foundUser(req, res, next) {
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser)
      return res
        .status(400)
        .json({ error: "User with that email already exist!" });
    next();
  },

  async addNewUser(req, res) {
    // myilsayncvsjctnm
    // zpslkjtnxiqionuo
    const foundUserEmail = await User.findOne({ email: req.body.email });
    const foundUserName = await User.findOne({ name: req.body.name });
    if (foundUserEmail)
      return res
        .status(400)
        .json({ error: "User with that email already exists!" });
    if (foundUserName)
      return res
        .status(400)
        .json({ error: "User with that name already exists!" });
    try {
      const user = await new User(req.body);
      if (req.body.role === "student") {
        user.student = true;
        const school = await User.findOne({
          name: req.body.schoolName,
          school: true,
        });
        console.log("school", school);
        if (!school)
          return res.status(400).json({ error: "No school with that name" });
        school.students.push(user);
        await school.save();
      }
      if (req.body.role === "school") {
        user.school = true;
      }
      if (req.body.role === "admin") {
        user.admin = true;
      }
      if (req.file) {
        user.image.data = req.file.buffer;
        user.image.contentType = req.file.mimetype;
      }
      await user.setPassword(req.body.password);

      user.save(async (err, user) => {
        if (err) return res.status(400).json({ err });
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          service: "gmail",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "irobochakrabloq@gmail.com", // generated ethereal user
            pass: "zzshbnhdhcskfjyv", // generated ethereal password
          },
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: `${req.user.email}`, // sender address
          to: user.email, // list of receivers
          subject: "IRCBloq", // Subject line
          text: "Confirm login to IRCBloq", // plain text body
          html: `<b>Welcome to IRCBloq your login credentials are >> </b> your email: ${user.email}, your username: ${user.name} and your password: ${req.body.password}`, // html body
        });

        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return res.json({ message: "User successfully added!" });
      });
    } catch (err) {
      // console.log(err)
      return res.status(400).json({ err: "Something went wrong" });
    }
  },

  async getUsers(req, res) {
    try {
      const users = await User.find().select("-image -students -data");
      return res.json(users);
    } catch (err) {
      console.log(er);
    }
  },

  async getStudents(req, res) {
    const users = await User.find({ student: true }).select(
      "-image -students -data"
    );
    return res.json(users);
  },

  async getSchools(req, res) {
    const users = await User.find({ school: true }).select(
      "-image -students -data"
    );
    return res.json(users);
  },

  async getUser(req, res) {
    const user = await User.findById(req.params._id)
      .populate("students")
      .select("-image");
    // console.log(user)
    return res.json(user);
  },

  async updateStudent(req, res) {
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

    if (req.body.role === "student") {
      user.student = true;
      user.school = false;
      user.admin = false;
      const school = await User.findOne({ name: req.body.schoolName });
      if (!school)
        return res.status(400).json({ error: "No school with that name" });
      school.students.push(user);
      await school.save();
    }
    if (req.body.role === "school") {
      user.school = true;
      user.student = false;
      user.admin = false;
    }
    if (req.body.role === "admin") {
      user.admin = true;
      user.student = false;
      user.school = false;
    }

    if (req.file) {
      user.image.data = req.file.buffer;
      user.image.contentType = req.file.mimetype;
    }

    // console.log(user)

    if (req.body.password) {
      await user.setPassword(req.body.password);
    }

    user.save((err, user) => {
      if (err) return res.status(401).json({ err });
      return res.json({ message: "User updated successfully!" });
    });
  },

  async getUserStatus(req, res) {
    const statuses = await User.schema.path("status").enumValues;
    // console.log(statuses)
    return res.json(statuses);
  },

  async updateUserStatus(req, res) {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId1 },
      { status: req.body.status }
    );

    user.save((err, user) => {
      if (err) return res.status(401).json({ err });
      return res.json(user);
    });
  },

  async updatePassword(req, res) {
    const user = await req.user;
    if (!user)
      return res.status(400).json({ error: "User is not authenticated!" });
    user.changePassword(
      req.body.oldPassword,
      req.body.newPassword,
      (err, user) => {
        if (err)
          return res.status(400).json({ error: "Old password is not correct" });
        if (user) {
          return res.json({ message: "Password changed successfully" });
        }
      }
    );
  },

  async removeUser(req, res) {
    const user = await User.findById(req.params.userId1);
    // console.log('user to delete', user)
    const posts = await Post.deleteMany({ user: req.params.userId1 });
    // console.log('posts', posts)
    const school = await User.findOneAndUpdate(
      { name: user.schoolName },
      {
        $pull: user._id,
      }
    );

    user.remove((err, user) => {
      if (err) return res.status(400).json({ err });

      return res.json({ message: "User deleted!" });
    });
  },

  getUserImage(req, res) {
    res.set("Content-Type", req.user.image.contentType);
    return res.send(req.user.image.data);
  },

  async putForgetPassword(req, res) {
    const token = await crypto.randomBytes(20).toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "No user with such email!" });
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    user.save(async (err, user) => {
      if (err) return res.status(400).json({ err });
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        service: "gmail",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "irobochakrabloq@gmail.com", // generated ethereal user
          pass: "zzshbnhdhcskfjyv", // generated ethereal password
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `irobochakrabloq@gmail.com`, // sender address
        to: user.email, // list of receivers
        subject: "IRCBloq - Reset Password", // Subject line
        text: "Confirm login to IRCBloq", // plain text body
        html: `<p>You are receiving this because you have requested the reset of the password of your account</p>.<b>Please click on the following link, or copy and paste it into your browser to complete the process: https://irc-dashboard.herokuapp.com/reset/${token}</b>. If you didn't request this, please ignore this email and your password will remaine unchanged.`,
      });

      return res.json({
        message: `An email has been sent to ${user.email} with further instructions`,
      });
    });
  },

  async getReset(req, res) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ error: "Password reset token is invalid or expired" });
    return res.json(user);
  },

  async putReset(req, res) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ error: "Password reset token is invalid or expired" });
    await user.setPassword(req.body.password);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.save((err, user) => {
      if (err) return res.status(400).json({ err });
      return res.json({ message: "Password changed successfully" });
    });
  },
};
