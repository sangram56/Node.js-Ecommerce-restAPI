const Product = require("../model/ProductModel");

const productCtrl = {
  //for get all product
  getAll: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json({
        data: products,
        length: products.length,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  //get single product
  getSingle: async (req, res) => {
    try {
      const product = await Product.findById({ _id: req.params.id });
      res.status(200).json({ data: product });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  //create a product
  create: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        image,
        desc,
        content,
        stock,
        discount,
        category,
      } = req.body;
      if (!image) return res.status(400).json({ msg: "no image found" });
      const product = await Product.findOne({ product_id });
      if (product) return res.status(400).json({ msg: "product exists" });
      //key value pair same so we write the object like this
      const newProduct = Product({
        product_id,
        title,
        price,
        image,
        desc,
        content,
        stock,
        discount,
        category,
      });
      await newProduct.save();
      res.status(200).json({ msg: "product created succesfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  //update a product
  update: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        image,
        desc,
        content,
        stock,
        discount,
        category,
      } = req.body;
      if (!image) return res.status(400).json({ msg: "no image found" });
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          product_id,
          title,
          price,
          image,
          desc,
          content,
          stock,
          discount,
          category,
        }
      );
      res.status(200).json({ msg: "product updated" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  //delete a product
  delete: async (req, res) => {
    try {
      await Product.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ msg: "product deleted" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
