const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
connectToDb();

// Configure CORS to allow credentials from the frontend dev server
const corsOptions = {
  origin: true, // ✅ allow dev tunnel origin
  credentials: true,
};

app.use(cors(corsOptions));

 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);
module.exports = app;
