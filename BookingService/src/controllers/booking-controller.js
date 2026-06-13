const {BookingService}=require('../services/index');
const {StatusCodes}=require('http-status-codes');
const bookingService=new BookingService();

const {createChannel,publishMessage}=require('../utils/messageQueue');
const {REMINDER_BINDING_KEY}=require('../config/serverConfig');
class BookingController{

    async sendMessageToQueue(req,res){

        const channel=await createChannel();
        const payload={
           data:{
                subject:'This is a noti from queue',
                content:"Some queue will subscribe this",
                receipientEmail:"sundaramgupta062@gmail.com",
                notificationTime:"2026-06-05T10:22:24"
           },
           service:'CREATE_TICKET'
        };
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
        return res.status(200).json({
            message:"Succesfully published the event"
        });
    }


    async createBooking(req,res){
        try {
        const response=await bookingService.createBooking(req.body);
        
        return res.status(StatusCodes.OK).json({
            data:response,
            message:'Succesfully completed the booking',
            success:true,
            err:{}
        })
    } catch (error) {
         return res.status(error.statusCode).json({
            data:{},
            message:error.message,
            success:false,
            err:error.explanation
        })
        }
    }
}


module.exports=BookingController


