const  ValidationError  = require('../utils/validation-error');
const {User,Role}=require('../models/index');
const ClientError = require('../utils/client-error');
const {StatusCodes}=require('http-status-codes');

class UserRepository{

    // create
    async createUser(data){
        try {
            const user=await User.create(data);
            return  user;
        } catch (error) {
            if(error.name=='SequelizeValidationError'){
               let validationError= new ValidationError(error);
               throw validationError;
            }
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

    // delete
    async deleteUser(userId){
        try {
            await User.destroy({
                where:{
                    id:userId
                }
            });
            return true;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

    // update
    async updateUser(userId){
        try {
            const user=await User.findByPk(userId,{
                attributes:['email','id']
            });
           
            return user;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

    // getby id
    async getUser(userId){
        try {
            const user=await User.findByPk(userId);
            return user;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }

    async getByEmail(userEmail){
        try {
            const user=await User.findOne({
                where:{
                    email:userEmail
                }
            })
            
            if(user==null){
                throw new ClientError(
                    'AttributeNotFound',
                    'Invalid sent in the request',
                    'Please check the email as there is no record of the email',
                    StatusCodes.NOT_FOUND
                );
            }
            return user;
        } catch (error) {
            console.log('Something went wrong in repository layer');
            throw error;
        }
    }
    async isAdmin(userId){
            try {
                const user=await User.findByPk(userId);
                const adminRole=await Role.findOne({
                    where:{
                        name:"ADMIN"
                    }
                })
                return user.hasRole(adminRole);
            } catch (error) {
                 console.log('Something went wrong in repository layer');
                throw error;
            }
    }
    
}
module.exports= {
    UserRepository
};
