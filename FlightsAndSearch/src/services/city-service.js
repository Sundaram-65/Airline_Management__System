const {CityRepository} =require('../repository/index')

class CityService{

    constructor(){
        this.CityRepository=new CityRepository();
    }

    async createCity(data){
        try {
            const city =await this.CityRepository.createCity(data);
           
            return city;
        } catch (error) {
            console.log('Something went wrong at service layer');
            throw error;
        }
    }
    async deleteCity(cityid){
        try {
             const city = await this.CityRepository.deleteCity(cityid);
             return city;
        } catch (error) {
            console.log('Something went wrong at service layer');
            throw error;
        }
    }
    async updateCity(data,cityid){
        try {
             const city = await this.CityRepository.updateCity(data,cityid);
             return city;
        } catch (error) {
            console.log('Something went wrong at service layer');
            throw error;
        }
    }
    async getCity(cityid){
        try {
            const city = await this.CityRepository.getCity(cityid);
            return city;
        } catch (error) {
            console.log('Something went wrong at service layer');
            throw error;
        }
    }
    async getAllCities(filter){
        try {
            
            const cities=await this.CityRepository.getAllCities({name:filter.name});
            return cities;
        } catch (error) {
            console.log('Something went wrong at service layer');
            throw error;
        }
    }
    async addMultipleCities(cities){
    
            try {
                const result=await this.CityRepository.addMultipleCities(cities);
                return result;
            } catch (error) {
                console.log('Something went wrong in the service layer');
                throw error;
            }
    }
    async getAllairports(cityId){
    
            try {
                const city=await this.CityRepository.getCity(cityId);
                const airports=await city.getAirports();
                return airports;
            } catch (error) {
                console.log('Something went wrong in the service layer');
                throw error;
            }
    }
}
module.exports=CityService