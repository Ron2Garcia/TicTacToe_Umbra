require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const gameRecordRoutes = require('./routes/gameRecords')
const winningPatternRoutes = require('./routes/winningPatterns')

const app = express();

// middleware
const corsOptions = {
    origin: "http://localhost:3000" // frontend URI (ReactJS)
}
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {   
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/gameRecords', gameRecordRoutes);
app.use('/api/winningPatterns', winningPatternRoutes);

// connect to database
mongoose.connect(process.env.MONG_URI)
.then(() => {
    console.log('MongoDB is connected')
})
.catch((error) => {
    console.log(error)
});

// listen to request
app.listen(process.env.PORT, () => {
    console.log('listening on port',process.env.PORT)
});

