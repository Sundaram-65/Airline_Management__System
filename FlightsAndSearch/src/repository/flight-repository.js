const {Op}=require('sequelize')
const {Flight}=require('../models/index')

class FightRepository{
    // create

    #createFilter(data) {
        let filter = {};

        if (data.arrivalAirportId) {
            filter.arrivalAirportId = data.arrivalAirportId;
        }

        if (data.departureAirportId) {
            filter.departureAirportId = data.departureAirportId;
        }

        //  price filter (correct way)
        if (data.minPrice || data.maxPrice) {
            filter.price = {};
            
            if (data.minPrice) {
                filter.price[Op.gte] = data.minPrice;    
            }

            if (data.maxPrice) {
                filter.price[Op.lte] = data.maxPrice;
            }
        }

        // filter = {
        //     price: {
        //         [Op.gte]: 1000,
        //         [Op.lte]: 5000
        //     }
        // }
        return filter;
        
}
    async createFlight(data){

        try {
            // const flight=await Flight.create({
            //     flightNumber:data.flightNumber,
            //     airplaneId:data.airplaneId,
            //     departureAirportId:data.departureAirportId,
            //     arrivalAirportId:data.arrivalAirportId,
            //     departureAirportId:data.departureAirportId,
            //     arrivalTime:data.arrivalTime,
            //     departureTime:data.departureTime,
            //     price:data.price,
            //     boardingGate:data.boardingGate,
            //     totalSeats:data.totalSeats,
            // })
            const flight =await Flight.create(data);
            return flight;

        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

    // delete
    async deleteFlight(flightId){

        try {
            const flight=await Flight.destroy({
                where:{
                    id:flightId
                }
            })
            return flight;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

    // get

    async getFlight(flightId){
        try {
            const flight=await Flight.findOne({
                where:{
                    id:flightId
                }
            });
            return flight;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

    // allFlights
    async getAllFlight(filter){

        try {
            const fliterObject=this.#createFilter(filter);

            const flights=await Flight.findAll({
                where:fliterObject
            });
            return flights;
        } catch (error) {
           console.log('Something went wrong in repository layer');
           throw error;
        }
    }
    
    // update
    async updateFlight(data,flightId){

        try {
            const flight=await Flight.update(data,{
                where:{
                    id:flightId
                }
            })
            return flight;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }
     
    }
    module.exports=FightRepository


