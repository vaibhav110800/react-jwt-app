require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const connection = require("./db");
const router=require("./routes/router");
const registerRoutes = require("./routes/register-route");
const loginRoutes = require("./routes/login-route");

// database connection
const connectDB=require('./database/db')
connectDB();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/", router);
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
