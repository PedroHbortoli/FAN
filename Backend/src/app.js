const express = require("express");
const dotenv = require("dotenv").config();
const fanRouter = require('./router/fanRouter');
const cors = require('cors');
const app = express();

app.set("port", process.env.PORT || 3003);
app.use(express.json());
app.use(cors());
app.use('/backend', fanRouter);

module.exports = app;