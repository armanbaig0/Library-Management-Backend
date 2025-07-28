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
    origin : "https://library-management-front-end-tau.vercel.app",
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
    
    try {
        await sequelize.authenticate();
        console.log("Database Connected!");

        // 🔥 Add this line to sync models/tables with Render-hosted DB
        await sequelize.sync({ alter: true }); // 👈 this line creates/updates tables
        console.log("Tables synced successfully.");
    } catch (err) {
        console.error("DB connection failed:", err);
    }
});