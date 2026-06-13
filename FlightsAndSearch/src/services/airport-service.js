const {AirportRepository}=require('../repository/index')

const airportRepository=new AirportRepository();

class AirportService{

    // create 
    async createAirport(data){

        try {
            
            const airport =await airportRepository.createAirport(data);
            return airport;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }

    // delete

    async deleteAirport(airportid){
        try {
            const airport =await airportRepository.deleteAirport(airportid);
            return airport;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }

    // get
    async getAirport(airportid){
        try {
            const airport=await airportRepository.getAirport(airportid);
            return airport;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }
    //getAll
    async getAllAirport(){
        try {
            const airports=await airportRepository.getAllAirport();
            return airports;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }
    // update
    async updateAirport(data,airportid){    

        try {
            const airport =await airportRepository.updateAirport(data,airportid);
            return airport;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }

}
module.exports=AirportService