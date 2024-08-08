
const http = require("http");

const app = require("./src/models/app");

const connectDB = require('./src/db/connect')

require('dotenv').config();

const port = 5000;


const server = http.createServer(app);

connectDB();

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});