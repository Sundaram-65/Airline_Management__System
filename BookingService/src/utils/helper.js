const sender=require('../config/emailConfig');
const {createChannel,publishMessage}=require('./messageQueue');
const {REMINDER_BINDING_KEY}=require('../config/serverConfig');

const sendMessageToQueue = async (receipientEmail,bookingData) => {

    const channel = await createChannel();

    const payload = {
        data: {
            subject: 'Your Boarding Pass - SkyBooker Airlines', 
            content: 'Please find your ticket details below.',
            receipientEmail: receipientEmail,
            notificationTime: new Date().toISOString(),

            // Extra fields we can send Ticket fields for the HTML template in cron job
            // For this we need to update the notifucationTicket model in remainder service
            // passengerName:  bookingData.passengerName  || 'Passenger',
            // flightNumber:   bookingData.flightNumber   || '',
            // seat:           bookingData.seat           || '',
            // from:           bookingData.from           || '',
            // to:             bookingData.to             || '',
            // departureTime:  bookingData.departureTime  || '',
            // date:           bookingData.date           || new Date().toDateString(),
            // bookingId:      bookingData.bookingId      || '',
            // class:          bookingData.class          || 'Economy',
            
        },
        service: 'CREATE_TICKET'
    };

    publishMessage(
        channel,
        REMINDER_BINDING_KEY,
        JSON.stringify(payload)
    );

    return true;
}


const getBookingConfirmationTemplate = (userEmail) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">

        <!-- Wrapper -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding: 40px 0;">
            <tr>
                <td align="center">

                    <!-- Card -->
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1a73e8, #0d47a1); padding: 40px; text-align:center;">
                                <h1 style="color:#ffffff; margin:0; font-size:28px; letter-spacing:1px;"> SkyBooker Airlines</h1>
                                <p style="color:#bbdefb; margin:8px 0 0; font-size:14px;">Your journey begins here</p>
                            </td>
                        </tr>

                        <!-- Success Banner -->
                        <tr>
                            <td style="background-color:#e8f5e9; padding: 20px; text-align:center; border-bottom: 2px solid #c8e6c9;">
                                <h2 style="color:#2e7d32; margin:0; font-size:20px;"> Booking Confirmed!</h2>
                                <p style="color:#388e3c; margin:6px 0 0; font-size:14px;">Your seat has been successfully reserved.</p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 32px 40px;">
                                <p style="color:#37474f; font-size:16px; margin:0 0 16px;">Dear Passenger,</p>
                                <p style="color:#546e7a; font-size:15px; line-height:1.7; margin:0 0 24px;">
                                    Thank you for choosing <strong>SkyBooker Airlines</strong>. 
                                    Your booking has been confirmed and your ticket is ready.
                                    We look forward to welcoming you on board!
                                </p>

                                <!-- Booking Details Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4ff; border-radius:8px; padding:0; margin-bottom:24px;">
                                    <tr>
                                        <td style="padding:20px;">
                                            <p style="margin:0 0 12px; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#1a73e8; font-weight:bold;">📋 Booking Details</p>
                                            <table width="100%" cellpadding="6" cellspacing="0">
                                                <tr>
                                                    <td style="color:#78909c; font-size:14px;">Email</td>
                                                    <td style="color:#263238; font-size:14px; font-weight:bold;">${userEmail}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color:#78909c; font-size:14px;">Status</td>
                                                    <td style="font-size:14px;">
                                                        <span style="background:#e8f5e9; color:#2e7d32; padding:3px 10px; border-radius:12px; font-size:13px; font-weight:bold;">Confirmed</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="color:#78909c; font-size:14px;">Date</td>
                                                    <td style="color:#263238; font-size:14px;">${new Date().toDateString()}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Tips -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="border-left: 4px solid #1a73e8; padding-left:0; margin-bottom:24px;">
                                    <tr>
                                        <td style="padding: 12px 16px; background:#f8f9ff;">
                                            <p style="margin:0; color:#1a73e8; font-size:13px; font-weight:bold;">💡 Travel Tips</p>
                                            <ul style="margin:8px 0 0; padding-left:18px; color:#546e7a; font-size:13px; line-height:1.8;">
                                                <li>Arrive at the airport at least <strong>2 hours</strong> before departure</li>
                                                <li>Carry a valid government-issued photo ID</li>
                                                <li>Check baggage allowance before packing</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color:#546e7a; font-size:14px; line-height:1.7;">
                                    If you have any questions, feel free to reply to this email or contact our support team.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f0f4ff; padding:24px 40px; text-align:center; border-top:1px solid #e3e8f0;">
                                <p style="margin:0 0 8px; color:#1a73e8; font-size:14px; font-weight:bold;">✈️ SkyBooker Airlines</p>
                                <p style="margin:0; color:#90a4ae; font-size:12px;">© ${new Date().getFullYear()} SkyBooker. All rights reserved.</p>
                                <p style="margin:8px 0 0; color:#90a4ae; font-size:11px;">
                                    You received this email because you made a booking with us.
                                </p>
                            </td>
                        </tr>

                    </table>
                    <!-- End Card -->

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
};

const sendBasicEmail = async (mailFrom, mailTo, mailSubject, mailBody) => {
    try {
        const response = await sender.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: mailSubject,
            html: getBookingConfirmationTemplate(mailTo), // ✅ HTML email
            text: mailBody  
        });
        console.log('Email sent:', response.messageId);
    } catch (error) {
        console.log('Email error:', error);
    }
};

   

// }
module.exports={
    sendMessageToQueue,
    sendBasicEmail
}