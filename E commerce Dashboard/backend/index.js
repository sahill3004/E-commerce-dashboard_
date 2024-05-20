const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const JWT = require("jsonwebtoken");
// const jwtkey = "e-comm";
const dotenv = require('dotenv');
dotenv.config()

const MONGO_URL = process.env.MONGO_URL;

const app = express();

const port = process.env.PORT || 5000

app.use(express.json());
app.use(cors());



app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  JWT.sign({ result }, process.env.JWTKEY, { expiresIn:process.env.ACCESS_TOKEN_EXPIRE }, (err, token) => {
    if (err) {
      res.send({
        result: "Someting went wrong, Please try after sometime !!"
      });
    }
    res.send({ result, auth: token });
  });
  // res.send("API in progress")
});

app.post("/login",async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      JWT.sign({ user }, process.env.JWTKEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE}, (err, token) => {
        if (err) {
          res.send({
            result: "Someting went wrong, Please try after sometime !!"
          });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "No user found" });
    }
  } else {
    res.send({ result: "Email and password mandatory" });
  }
});

app.post("/add-product",verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/products", verifyToken,async (req, res) => {
  const products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No product found" });
  }
});

app.delete("/product/:id",verifyToken, async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id",verifyToken, async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ Result: "No Record Found." });
  }
});

app.put("/product/:id",verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/search/:key",verifyToken,async (req, res) => {
  let result = await Product.find({
    $or: [
      {
        name: { $regex: req.params.key },
      },
      {
        company: { $regex: req.params.key },
      },
      {
        category: { $regex: req.params.key },
      },
    ],
  });
  res.send(result);
});

function verifyToken(req,res,next){
    console.warn(req.headers['authorization']);
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
       JWT.verify(token, process.env.JWTKEY,(err,valid)=>{
        if(err){
          res.status(401).send({result:'Please provide a valid token'})
        }else{
          next();
        }
       })
    }else{
        res.status(403).send({result:'Please provide a token'})
    }
    
}

app.listen(5000);
