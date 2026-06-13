const {NotificationTicket}=require('../models/index');
const notificationticket = require('../models/notificationticket');
const {Op}=require('sequelize');

class TicketRepository{

    async getAll(){
        try {
            const tickets=await NotificationTicket.findAll();
            return tickets;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async create(data){
       try {
          const ticket=await NotificationTicket.create(data);
          return ticket;
       } catch (error) {
         console.log(error);
         throw error;
       }
    }

    async get(filter){
        try {
            const tickets=await NotificationTicket.findAll({
                where:{
                    status:filter.status,
                    notificationTime:{
                        [Op.lte]:new Date()
                    }
                }
            });
            return tickets;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(ticketId,status){
        try {
            const ticket=await NotificationTicket.findByPk(ticketId);
            if(status){
                ticket.status=status;
            }
            await ticket.save();
            return ticket;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports=TicketRepository;