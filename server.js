const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 10000;
const server = express();

const connectDB = require("./db/db");
// const connectProductDB = require('./db/dbprod')




  connectDB();
  // connectProductDB()




server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/userRoutes");
server.use("/api/user", userRoute);

const productRoute = require('./routes/productRoutes');
server.use('/api/product', productRoute)

server.get("/api", (req, res) => {
  res.json({ message: "my server" });
});

server.listen(PORT, () => {
  console.log("server started successfully");
});
