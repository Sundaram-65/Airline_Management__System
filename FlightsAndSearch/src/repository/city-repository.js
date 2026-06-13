const { City,Airport } = require('../models/index');
const {Op}=require('sequelize')
class CityRepository {
    async createCity({ name }) {
        try {
            const city = await City.create({ name });
            return city;
        } catch (error) {
            console.log('Something went wrong in the repository layer');
            throw error;
        }
    }

    async deleteCity(cityid) {
        try {
            const city = await City.destroy({
                where: {
                    id: cityid
                }
            });
            return city;
        } catch (error) {
            console.log('Something went wrong in the repository layer');
            throw error;
        }
    }

    async updateCity(data, cityid) {
        try {
            // const city = await City.update(data, {
            //     where: {
            //         id: cityid
            //     }
            // });
            // return city;
            // In pgsql there is returning :true which work and give updated data

            // If we want updated data we use the below approach
            const city=await City.findByPk(cityid);
            city.name=data.name;
            return city;
        } catch (error) {
            console.log('Something went wrong in the repository layer');
            throw error;
        }
    }

    async getCity(cityid) {
        try {
            const city = await City.findByPk(cityid);
            return city;
        } catch (error) {
            console.log('Something went wrong in the repository layer');
            throw error;
        }
    }

    async getAllCities(filter){// filter can be empty
        try {
            if(filter.name){

                const cities=await City.findAll({
                    where:{
                        name:{
                            [Op.startsWith]:filter.name
                        }
                    }
                })
                return cities;
            }
            const cities=City.findAll();
            return cities;
        } catch (error) {
            console.log('Something went wrong in the repository layer');
            throw error;
        }
    }
    async addMultipleCities(cities){

        try {
            const result=await City.bulkCreate(cities);
            return result;
        } catch (error) {
            console.log('Something went wrong in the repository layer');
            throw error;
        }
    }
    async getAllairports(cityId){

        try {
            // 1.
            const city=await City.findByPk(cityId);
            const airports=await city.getAirports();

            //2.
            // const airports=await City.findByPk(cityId,{
            //     include:[Airport]
            // })

            //3.
            // const airports=await Airport.findAll({
            //     where:{
            //         cityId:cityId
            //     }
            // })
            return airports;
        } catch (error) {
            console.log('Something went wrong in the repository layer');
            throw error;
        }
    }
}

module.exports = CityRepository;