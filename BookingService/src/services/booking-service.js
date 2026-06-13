const axios=require('axios');
const {BookingRepository}=require('../repository/index');
const { ServiceError } = require('../utils/errors');
const {FLIGHT_SERVICE_PATH,AUTH_SERVICE_PATH}=require('../config/serverConfig')
const bookingRepository=new BookingRepository();
const {sendBasicEmail,sendMessageToQueue}=require('../utils/helper');
class BookingService{

    async createBooking(data){

        try {
            const flightId=data.flightId;

            const getFlightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;

            const flight=await axios.get(getFlightRequestUrl);
            // console.log('From service',flight.data.data);
            // const booking =await bookingRepository(data);
            // return booking;
            // return flight.data.data;
            const flightData=flight.data.data;
            const flightPrice=flightData.price;
            if(data.noOfSeats>flightData.totalSeats){
                throw  new ServiceError();
            }

            const totalCost=flightPrice*data.noOfSeats;
            const bookingPayload={...data,totalCost};
            const booking=await bookingRepository.createBooking(bookingPayload);

            const updateFlightRequesturl=`${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}`;
            await axios.patch(updateFlightRequesturl,{
                totalSeats:flightData.totalSeats-booking.noOfSeats
            });

            const finalBooking =await bookingRepository.updateBooking({status:'Booked'},booking.id);
            
            
            const userId=data.userId;
            const getUserUrl=`${AUTH_SERVICE_PATH}/api/v1/user/${userId}`;
            const user=await axios.get(getUserUrl);
            const userEmail=user.data.data.email;
            sendBasicEmail('Airline@gmail.com',userEmail,'Booking Confirmation','Congratulation Booking Succesfull');
            sendMessageToQueue(userEmail);
            
            return finalBooking;
            

        } catch (error) {
            if(error.name=='SequelizeValidatioError' || error.name=='RepositoryError'){
                throw error;
            }
            throw new ServiceError(error);
           
        }
    }
}
module.exports=BookingService;