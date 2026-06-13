const {AirplaneRepository}=require('../repository/index');

const airplaneRepository= new AirplaneRepository();

class AirplaneService{


    // create
    async createAirplane(data){
        try {
            const airplane=await airplaneRepository.createAirplane(data);
            return airplane;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }

    // delete
    async deleteAirplane(airplaneId){
        try {
            const airplane=await airplaneRepository.deleteAirplane(airplaneId);
            return airplane;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }

    // get 
    async getAirplane(airplaneId){
        try {
            const airplane=await airplaneRepository.getAirplane(airplaneId);
            return airplane;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }


    // update

    async updateAirplane(data,airplaneId){
        try {
            const airplane=await airplaneRepository.updateAirplane(data,airplaneId);
            return airplane;
        } catch (error) {
            console.log('Something went wrong in service layer');
            throw error;
        }
    }
}

module.exports=AirplaneService;
