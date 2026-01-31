const express = require('express');
const router = express.Router();
const mapcontroller = require('../controllers/maps.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { query } = require('express-validator');

router.get(
    //giving address or lat and long for the given address
  '/get-coordinates',
  query('address').isString().isLength({ min: 3 }),
  authMiddleware.authUser,
  mapcontroller.getCoordinates
);
router.get('/get-distance-time', 
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser,//for to visible to authenticated users only
    mapcontroller.getDistanceTime

);
router.get('/get-suggestions', 
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,//for to visible to authenticated users only
    mapcontroller.getAutoCompleteSuggestions
);
module.exports = router;
