const express = require('express')
const cors = require("cors");
const path = require('path')
const cookieParser = require('cookie-parser')
const { sequelize, user } = require('./models')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const studentRoute = require('./routes/studentRoute')
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/files', express.static(path.join(__dirname, 'public/files')));
app.use(cors({
    origin : "http://localhost:3000",
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials : true
}));

// Mount routes
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/student', studentRoute);

// start server
app.listen({ port: 5000 }, async () => {
    console.log("Server is running on port : 5000");
    await sequelize.authenticate()
    console.log("Database Connected!");
});