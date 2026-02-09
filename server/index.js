const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const MONGODB = process.env.MONGODB;
//callback function
app.get("/", (req, res) => {
  res.send("Welcome to Mern Chat Server");
});
app.use(
  cors({
    origin: BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to mongodb
if (!MONGODB) {
  console.log("NO MongoDB URL found in .env");
} else {
  mongoose
    .connect(MONGODB)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB:", err);
    });
}

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
