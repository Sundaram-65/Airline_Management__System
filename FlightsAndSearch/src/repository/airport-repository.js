const {Airport}=require('../models/index');

class AirportRepository{

    // create->airport/

    async createAirport(data){

        try {
            const airport =await Airport.create({
                name:data.name,
                cityId:data.cityId
            })
            return airport;

        } catch (error) {
            console.log('Something went wrong in repository');
            throw error
        }
    }

    // delete:
    async deleteAirport(airportid){

        try {
            const airport=await Airport.destroy({
                where:{
                    id:airportid
                }
            });
            return airport;
        } catch (error) {
            console.log('Something went wrong in repository');
            throw error
        }
    }

    // get 
    async getAirport(airportid){

        try {
             const airport=await Airport.findOne({
                where:{
                    id:airportid
                }
            })
            return airport;

        } catch (error) {
            console.log('Something went wrong in repository');
            throw error
        }
    }

    // getAll
    async getAllAirport(){

        try {
            const airports=await Airport.findAll();
            return airports;
        } catch (error) {
            console.log('Something went wrong in repository');
            throw error
        }
    }

    // update
    async updateAirport(data,airportid){

        try {
            const airports=await Airport.update(data,{
                where:{
                    id:airportid
                }
            });
            return airports;
        } catch (error) {
            console.log('Something went wrong in repository');
            throw error
        }
    }


}
module.exports=AirportRepository
