const mongoose = require('mongoose');

function connectToDb() {
    console.log("MONGO_URI =", process.env.MONGO_URI); // 👈 ADD THIS

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(err => {
            console.error('Mongo connection error:', err);
        });
}

module.exports = connectToDb;
