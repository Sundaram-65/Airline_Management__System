const sender=require('../config/emailConfig');
const TicketRepository=require('../repository/ticket-repository')
const ticketRepository=new TicketRepository();
const sendBasicEmail=async(mailFrom,mailTo,mailSubject,mailBody)=>{

   try {
    const response=await sender.sendMail({
        from:mailFrom,
        to:mailTo,
        subject:mailSubject,
        text:mailBody
    });
    console.log(response)
   } catch (error) {
    console.log(error)
   }
   

}

const fetchPendingEmail=async(timestamp)=>{
    try {
        const response=await ticketRepository.get({status:"Pending"});
        return response;
    } catch (error) {
        console.log(error);
    }
}

const createNotification=async(data)=>{
    try {
        const response=await ticketRepository.create(data);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateTicket=async(ticketId,status)=>{
    try {
        const response=await ticketRepository.update(ticketId,status);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const subscribeEvents=async (payload)=>{

    let service=payload.service;
    let data=payload.data;

    switch(service){

        case 'CREATE_TICKET':
            await createNotification(data);
            break;
        case 'SEND_BASIC_EMAIL':
            await sendBasicEmail(data);
            break;
        default:
            console.log('No valid event received');
            break;
    }
}
module.exports={
    sendBasicEmail,
    fetchPendingEmail,
    createNotification,
    subscribeEvents,
    updateTicket
}