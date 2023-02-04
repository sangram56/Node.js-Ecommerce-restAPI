//user model
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserCtrl = {
  //for register a user
  register: async (req, res) => {
    try {
      let { name, email, password, mobile } = req.body;
      const mob = await User.findOne({ mobile });
      if (mob)
        return res.status(400).json({ msg: "mobile number already exist" });
      const newemail = await User.findOne({ email });
      if (newemail) return res.status(400).json({ msg: "email already exist" });
      if (password.length < 5)
        return res
          .status(400)
          .json({ msg: "password must be more than 5 charecters " });
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = User({
        name,
        email,
        password: passwordHash,
        mobile,
      });
      // res.json({"register":newUser})
      await newUser.save();
      res.status(200).json({ msg: "user registred" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  //for login a user
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "user email doesnot exisyt" });
      const ismatch = await bcrypt.compare(password, user.password);
      if (!ismatch)
        return res.status(400).json({ msg: "password doesnot exist" });
      const accessToken = createAccessToken({ id: user._id });
      //for set the cookie in client side
      const refreshToken = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/auth/refreshToken",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  //time duration login to logout (manage the session )
  //it manage the login session of users on different browser
   refreshToken: async (req, res) => {
    try {
      const ref_token = req.cookies.refreshtoken;
      if (!ref_token) return res.status(400).json({ msg: "Please Login " });
      jwt.verify(ref_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "session expired logi again" });
        const accessToken = createAccessToken({ id: user.id });
        res.json({ accessToken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //for logout a user
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/auth/refreshToken" });
      return res.status(200).json({ msg: "logout succesfully " });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },


  //here we use the middleware for check the user is logged in or not
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user)
        return res.status(400).json({ msg: "user data doesnot exist" });
      res.json({ data: user });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
};

//for jwt verification
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
};

module.exports = UserCtrl;
