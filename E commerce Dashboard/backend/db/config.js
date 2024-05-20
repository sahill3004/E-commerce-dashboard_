// const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/ecommerce-backend")  ;


const mongoose = require("mongoose");
require('dotenv').config(); // Load environment variables from .env file

const mongoURI = process.env.MONGODB_URL;

mongoose.connect(mongoURI)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => {
  console.error("Error connecting to MongoDB:", err);
});




// const connectDb = async () =>{
//     try {
//         const connect = await mongoose.connect('mongodb://localhost:27017/ecommerce-backend');
//         console.log("Database connected:", connect.connection.host,connect.connection.name)
//     } catch (err) {
//         console.log(err)
//     }
// };
