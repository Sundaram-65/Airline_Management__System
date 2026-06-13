const amqplib=require('amqplib');
const {MESSAGE_BROKER_URL,EXCHANGE_NAME,REMINDER_BINDING_KEY}=require('../config/serverConfig');

const createChannel=async()=>{
    try {
        const connection =await amqplib.connect(MESSAGE_BROKER_URL);
        const channel=await connection.createChannel();
        
        await channel.assertExchange(EXCHANGE_NAME,'direct',{durable:true});
        return channel;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const subscribeMessage=async(channel,service, binding_key)=>{

    try {
        
        const applicationQueue=await channel.assertQueue('REMINDER_QUEUE');

        await channel.bindQueue(applicationQueue.queue,EXCHANGE_NAME,binding_key);

        channel.consume(applicationQueue.queue, (msg)=>{
            console.log('Received data');
            console.log(msg.content.toString());
            channel.ack(msg);
        })

    } catch (error) {
        throw error;
    }

}

const publishMessage=async(channel,binding_key,message)=>{
    try {
        await channel.assertQueue('REMINDER_QUEUE');
        channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
        console.log('Message Published');

    } catch (error) {
        throw error;
    }
}
module.exports={
    createChannel,
    subscribeMessage,
    publishMessage
}