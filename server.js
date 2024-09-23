const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 10000;
const server = express();

const connectDB = require("./db/db");
connectDB();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/userRoutes");
server.use("/api/user", userRoute);

server.get("/api", (req, res) => {
  res.json({ message: "my server" });
});

server.listen(PORT, () => {
  console.log("server started successfully");
});
