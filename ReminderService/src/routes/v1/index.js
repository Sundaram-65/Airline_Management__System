const express=require('express');
const router=express.Router();

const ticketController=require('../../controllers/ticket-controller');
router.post('/ticket',ticketController.create);
router.get('/tickets',ticketController.getAll);
router.get('/ticketpending',ticketController.fetchPendingEmail)
module.exports=router;