const AirplaneRepository = require("./airplane-repository");
const AirportRepository = require("./airport-repository");
const CityRepository = require("./city-repository");
const CrudRepository = require("./crud-repository");

module.exports={
    CityRepository:require('./city-repository'),
    AirportRepository:require('./airport-repository'),
    FlightRepository:require('./flight-repository'),
    AirplaneRepository:require('./airplane-repository')
}