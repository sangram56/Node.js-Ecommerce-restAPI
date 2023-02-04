//for the adimn
const User = require("../model/UserModel");
const authAdmin = async (req, res, next) => {
  try {
    //req.user.id comes from auth middleware 
    const user = await User.findOne({ _id: req.user.id });
    if (user.role === "user")
      return res
        .status(400)
        .json({ msg: "Admin Resources Access Denied for user" });
        next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authAdmin;
