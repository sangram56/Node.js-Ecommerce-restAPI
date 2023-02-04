const cloudinary = require("cloudinary");
const fs = require("fs");

//configuration files for cloudinary
cloudinary.config({
  cloud_name: require("../config.json").config.cloudinary_cloud,
  api_key: require("../config.json").config.cloudinary_api,
  api_secret: require("../config.json").config.cloudinary_secret,
});

const ImageCtrl = {
  //files is  from express file upload
  upload: async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({ msg: "no files were upload" });
      const file = req.files.myfiles; //myfiles from postman
      if (file.size > 1 * 1024 * 1024) {
        removeTemp(file.tempFilePath);
        return res
          .status(400)
          .json({ msg: "file size should be less than 1 mb " });
      }
      if (
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/jpg"
      ) {
        removeTemp(file.tempFilePath);
        return res.status(400).json({ msg: "invalid file format" });
      }
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: "EcommBackendAPI" },
        async (err, result) => {
          if (err) throw err;
          removeTemp(file.tempFilePath);
          res.json({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //for destroy a image
  destroy: async (req, res) => {
    try {
      const { public_id } = req.body;
      if (!public_id)
        return res.status(400).json({ msg: "no imaage selected" });
      cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
        if (err) return res.status(400).json({ msg: err.message });
        res.status(200).json({ msg: "image deleted succesfuly " });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

//for delete the temporary files
const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = ImageCtrl;
