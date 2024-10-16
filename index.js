const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const env = require('dotenv');
app.use(fileUpload());
const PORT = process.env.PORT || 8000;
const adminRouter = require('./Routers/admin/adminRouter')
const userRouter=require('./Routers/user');
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
env.config()
require('./config/db');
app.use("/api", adminRouter);
app.use("/api", userRouter);
app.use("/api/img", express.static("./upload"));

app.listen(PORT, () => {
  console.log("Hi server is running at  this :" + PORT)
})







