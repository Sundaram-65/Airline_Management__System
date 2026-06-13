const express=require('express');
const app = express();

const {PORT,DB_SYNC}=require('./config/serverConfig.js');
const bodyParser = require('body-parser');
const apiRoutes=require('./routes/index.js');
const db=require('./models/index.js');
const setupAndStartServer=()=>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true})); 

    app.use('/api',apiRoutes);

    // app.get('/api/v1/home',(req,res)=>{
    //     return res.json({
    //         message:'Hitting the booking service'
    //     })
    // })
    app.listen(PORT,()=>{
        console.log(`Server started at: ${PORT}`);

        if(DB_SYNC){
            db.sequelize.sync({alter:true});
        }
    })
}
setupAndStartServer();