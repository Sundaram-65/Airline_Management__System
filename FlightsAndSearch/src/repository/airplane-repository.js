const { where } = require('sequelize');
const {Airplane}=require('../models/index');

class AirplaneRepository{

    async createAirplane(data){
        try {
            const airplane=await Airplane.create({
                modelNumber:data.modelNumber,
                capacity:data.capacity
            })
            return airplane;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

    async deleteAirplane(airplaneId){
        try {
            const airplane=await Airplane.destroy({
               where:{
                id:airplaneId
               }
            })
            return airplane;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }
    async getAirplane(airplaneId){
        try {
            const airplane=await Airplane.findOne({
                where:{
                    id:airplaneId
                }
            })
            return airplane;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }
    async updateAirplane(data,airplaneId){
        try {
            const airplane=await Airplane.create(data,{
                where:{
                    id:airplaneId
                }
            })
            return airplane;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

}
module.exports=AirplaneRepository