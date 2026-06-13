const cron =require('node-cron');

const emailService =require('../services/email-service');

const sender=require('../config/emailConfig');

const getTicketTemplate = require('../utils/getTicketTemplate');

const setupJobs=()=>{

    cron.schedule('*/2 * * * *', async() => {
        const response=await emailService.fetchPendingEmail();
        
        response.forEach((email)=>{
            sender.sendMail({
                to:email.receipientEmail,
                subject:email.subject,
                html: getTicketTemplate({        // for this we need to update our notification model right now i seed the random data
                passengerName: 'Sundaram Gupta',
                flightNumber: 'SK-205',
                seat: '14A',
                from: 'BHOPAL',
                to: "GWALIOR",
                departureTime: '08:30 AM',
                date: 'Jun 15, 2026',
                bookingId: '#BK9921'
            }),
                text:email.content
            },async(err,data)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log(data);
                    await emailService.updateTicket(email.id,"Success");
                }
            })
        });
        console.log(response);
    });

}

      
module.exports=setupJobs;
