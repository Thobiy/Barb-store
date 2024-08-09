
const http = require("http");

const app = require("./src/models/app");

const connectDB = require('./src/db/connect')

require('dotenv').config();


const PORT = process.env.PORT || 5000


const server = http.createServer(app);

connectDB();

// server listening 
//server.listen(port, () => {
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});