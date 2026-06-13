const express =require('express');

const CityController=require('../../controllers/city-controller.js');
const AirportController=require('../../controllers/airport-controller.js');
const FlightController=require('../../controllers/flight-controller.js');
const AirplaneController=require('../../controllers/airplane-controller.js');

const {FlightMiddlewares}=require('../../middlewares/index.js')
const router=express.Router();

// city
router.post('/city',CityController.create);
router.post('/city/bulk',CityController.addMulCities)
router.delete('/city/:id',CityController.destroy);
router.get('/city/:id',CityController.get);
router.get('/city',CityController.getAll);
router.patch('/city/:id',CityController.update);

router.get('/city/:id/airports',CityController.getAllairports);



// airport
router.post('/airport',AirportController.createAirport);
// router.post('/airport/bulk',CityController.addMulCities)
router.delete('/airport/:id',AirportController.deleteAirport);
router.get('/airport/:id',AirportController.getAirport);
router.get('/airport',AirportController.getAllAirport);
router.patch('/airport/:id',AirportController.updateAirport);


// flight
router.post('/flight',
    FlightMiddlewares.validateCreateFlight,
    FlightController.createFlight
);
router.delete('/flight/:id',FlightController.deleteFlight);
router.get('/flight/:id',FlightController.getFlight);
router.get('/flight',FlightController.getAllFlight);
router.patch('/flight/:id',FlightController.updateFlight);


// airplane
router.post('/airplane',AirplaneController.createAirplane);
router.delete('/airplane/:id',AirplaneController.deleteAirplane);
router.get('/airplane/:id',AirplaneController.getAirplane);
router.patch('/airplane/:id',AirplaneController.updateAirplane);

module.exports=router;