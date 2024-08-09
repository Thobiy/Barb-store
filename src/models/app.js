
//require("dotenv").config();
//require("../../config/database").connect();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { httpLogin, httpProtected } = require("../controllers/auth.controller");


const Products = require("../models/products.model.js");
const { httpRegisterUser } = require("../controllers/user.controller.js");
//const cookieParser = require("cookie-parser");

const app = express();



// Middleware

app.use(cors({
  origin: " https://barb-store-p0lwiqm8a-thobiys-projects.vercel.app",
  credentials: true
}));
app.use(cookieParser());

app.use(express.json());

// Routes

app.post("/products", async (req, res) => {
  const newProduct = new Products(req.body);
  const savedProduct = await newProduct.save();

  res.json(savedProduct);

});

app.post("/login", httpLogin);
app.post("/register", httpRegisterUser);
app.post("/protected", httpProtected)


app.use("/*", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});
 

app.get("/", (req, res) => {
  
  res.json({message: "Application running "});

});

module.exports = app;


