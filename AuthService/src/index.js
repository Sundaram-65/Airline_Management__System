const express=require('express');
const {PORT}=require('./config/serverConfig');
const apiRoutes=require('./routes/index');
const bodyParser=require('body-parser')

// const {UserService}=require('./services/user-service');
const db=require('./models/index');
const {User,Role}=require('./models/index');
const app =express();

const prepareAndStartServer=async()=>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use('/api',apiRoutes);

    app.listen(PORT,async()=>{
        console.log(`Server started on Port: ${PORT}`);
        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true})
        }
        // const u1=await User.findByPk(2);
        // const r1=await Role.findByPk(1);
        
        // u1.addRole(r1);
        // const response=await r1.getUsers();
        // const response=await u1.hasRole(r1);
        // console.log(response);


    // const {UserRepository}=require('./repository/user-repository');
    // const repo=new UserRepository();
    // const response=await repo.getUser(2);
    // console.log(response);


    // const service=new UserService();
    // creation of token

    // const newtoken=service.createToken({email:'sg24365@gmail.com',id:'1'});
    // console.log('newtoken is:',newtoken);


    // verifytoken
    // const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNnMjQzNjVAZ21haWwuY29tIiwiaWQiOiIxIiwiaWF0IjoxNzc1NjcxOTczLCJleHAiOjE3NzU2NzU1NzN9.d3mN6eL1FQcKVqyQTHxAzICa_pKI34c915zztlLiWcE';
    // const response=service.verifyToken(token);
    // console.log(response);
    
    })

}

prepareAndStartServer();