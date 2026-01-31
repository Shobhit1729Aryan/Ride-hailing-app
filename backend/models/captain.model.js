const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength:[3, "First name must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minlength:[3, "Last name must be at least 3 characters long"],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength:[5, "Email must be at least 3 characters long"],
    },
    password: {
        type: String,
        required: true,
        select:false,
    },
    socketId: {//FOR LIVE TRACKING
        type: String,
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    vehicle:{
        color: {
            type: String,
            required: true,
        },
        // corrected field name: plate (was "plates")
        plate:{
            type: String,
            required: true,
            unique: true
        },
        capacity:{
            type: Number,
            required: true,
            min:[1, "Capacity must be at least 1 person",]
        },
        // corrected field name: vehicleType (was misspelled "vegicleType")
        vehicleType:{
            type: String,
            required: true,
            enum:['car','motorcycle','bicycle','auto'],
        }
    },
    location:{
        ltd:{
            type: Number,
        
        },
        long:{
            type: Number,
        }
    }

})

// instance method to generate token
captainSchema.methods.generateAuthToken =function(){
    const token = jwt.sign({_id: this._id},process.env.JWT_SECRET,{expiresIn: "24h"});
    return token;
}

// instance method to compare password (used after selecting +password)
captainSchema.methods.comparePassword = async function(plainPassword){
    return await bcrypt.compare(plainPassword, this.password);
}

// static method available on the model: allows calling captainModel.hashpassword(...)
captainSchema.statics.hashpassword = async function(password){
    return await bcrypt.hash(password,10);
}

const captainModel = mongoose.model('captain', captainSchema);
module.exports = captainModel;
