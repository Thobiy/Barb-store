
//require("dotenv").config();
//require("../../config/database").connect();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');

const { httpLogin, httpProtected, httpAuthStatus, httpTest, httpAddToCart, httpCreateProduct, httpGetProducts } = require("../controllers/auth.controller");


const Products = require("../models/products.model")
const { httpRegisterUser } = require("../controllers/user.controller.js");


const app = express();


app.use(cors({
  origin: 'http://127.0.0.1:5000',
  credentials: true

}))

/*

// Middleware for production
//app.use(cors({
  origin: " https://barb-store-p0lwiqm8a-thobiys-projects.vercel.app",
  credentials: true
}));

*/


app.use(cookieParser());

app.use(express.json());
//app.use(session({ /* session config */ }));

app.use(express.static(path.join(__dirname, '..', 'static')));

// Routes

app.post("/products", async (req, res) => {
  const newProduct = new Products(req.body);
  const savedProduct = await newProduct.save();

  res.json(savedProduct);

});

app.post("/login", httpLogin);
app.post("/register", httpRegisterUser);
app.post("/protected", httpProtected);
app.get("/auth-status", httpAuthStatus);
app.get("/test-cookie", httpTest);
app.post('/cart', httpAddToCart);
app.post('/products', httpCreateProduct);
app.get('/products', httpGetProducts);








app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});


app.use("/*", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});
 

app.get("/", (req, res) => {
  
  res.json({message: "Application running "});

});

module.exports = app;


