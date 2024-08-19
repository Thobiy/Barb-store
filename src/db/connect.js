
const mongoose = require('mongoose');


const connectDB = async () => {

    try {
        //const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING) 
        //const conn = await mongoose.connect("mongodb://localhost:27017/products");

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected: ${conn.connection.host}`)

    }catch (err) {
        console.log("MongoDB connection error", err);
    }
};



module.exports = connectDB;

