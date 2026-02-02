const mongoose = require('mongoose');

//connects to database
function connectToDb() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to DB');
    }).catch(err => console.log(err));

}

module.exports = connectToDb;