const route = require("express").Router();
const UserCtrl = require("../controller/UserCtrl");
const auth=require('../middleware/auth')

route.post("/register", UserCtrl.register);
route.post("/login", UserCtrl.login);
route.get("/logout", UserCtrl.logout);
route.get("/getUser",auth, UserCtrl.getUser);
route.get("/refreshToken", UserCtrl.refreshToken);
module.exports=route;
