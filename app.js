const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

//middleware
app.use(express.json());
app.use(morgan("tiny"));

require("dotenv/config");

const port = process.env.PORT;

const api = process.env.API_URL;

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  inStock: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    inStock: req.body.inStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(200).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection succeed!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("Running on port " + port);
});
