const express=require('express');
const router=express.Router();

// const {createChannel}=require('../../utils/messageQueue');
// const channel= createChannel();

const {BookingController}=require('../../controllers/index');
const bookingController=new BookingController();

router.get('/info',(req,res)=>{
    return res.json({
        message:"Response from routes"
    })
})
router.post('/bookings',bookingController.createBooking);
router.post('/publish',bookingController.sendMessageToQueue);
module.exports=router;