const {Booking}=require('../models/index');
const {ValidationError, AppError}=require('../utils/errors/index');

const {StatusCodes}=require('http-status-codes');
class BookingRepository{

    // create
    async createBooking(data){
        try {
            const booking=await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name=='SequelizeValidatioError'){
                throw new ValidationError(error);
            }

            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was a some issue creating the booking ,please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
           
        }
    }

    // delete

    async deleteBooking(bookingId){
        try {
            const booking=await Booking.destroy({
                where:{
                    id:bookingId
                }
            });
            return booking;
        } catch (error) {
            console.log('Something went wrong in BookingRepository');
            throw error;
        }
    }

    // get 

    async getBooking(bookingId){
        try {
            const booking=await Booking.findByPk(bookingId);
            return booking;
        } catch (error) {
            console.log('Something went wrong in BookingRepository');
            throw error;
        }
    }

    // update

    async updateBooking(data,bookingId){
        try {
            const booking=await Booking.findByPk(bookingId);
            if(data.status){
                booking.status=data.status;
            }
            await booking.save();
            return booking;
        } catch (error) {
            console.log('Something went wrong in BookingRepository');
            throw error;
        }
    }


};

module.exports=BookingRepository