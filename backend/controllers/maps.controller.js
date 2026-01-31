const mapservice = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const address = req.query.address;
        const coordinates = await mapservice.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        next(error);
    }
};
module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const origin = req.query.origin;
        const destination = req.query.destination;
        const distanceTime = await mapservice.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        next(error);
    }
};
module.exports.getAutoCompleteSuggestions=async(req,res,next)=>{
    try {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const  input =req.query.input;
        const suggestions=await mapservice.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        next(error);
    }
}