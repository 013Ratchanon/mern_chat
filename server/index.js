const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const friendRouter = require("./routers/friend.router");
const messageRouter = require("./routers/message.router");
const cookieParser = require("cookie-parser");
const { initSocket } = require("./socket");
dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const MONGODB = process.env.MONGODB;

app.get("/", (req, res) => {
  res.send("Welcome to Mern Chat Server");
});
app.use(
  cors({
    origin: BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/v1/friends", friendRouter);
app.use("/api/v1/messages", messageRouter);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
