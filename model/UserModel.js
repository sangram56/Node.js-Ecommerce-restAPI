const mongoose = require("mongoose");
const UserModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  favProducts: {
    type: Array,
    default: [],
  },
  cart: {
    type: Array,
    default: [],
  },
  role:{
    type:String,
    default:'user'
  }
});

module.exports = mongoose.model("users", UserModel);
