const route = require("express").Router();
const imageCtrl = require("../controller/ImageCtrl");

route.post("/upload", imageCtrl.upload);
route.post("/destroy", imageCtrl.destroy);

module.exports = route;
