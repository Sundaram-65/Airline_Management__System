const {UserService}=require('../services/user-service');

const userService=new UserService();
const createUser=async(req,res)=>{
    try {
        const response=await userService.createUser({
            email:req.body.email,
            password:req.body.password
        });
        return res.status(201).json({
            message:'Succesfully created a new user',
            data:response,
            success:true,
            err:{}
        })
    } catch (error) {
        return res.status(error.statusCode).json({
            message:error.message,
            data:{},
            success:false,
            err:error.explanation
        })
    }
}

const signIn=async (req,res)=>{
    try {
        const response=await userService.signIn(req.body.email,req.body.password);
        return res.status(200).json({
            message:'login Succesfully ',
            data:response,
            success:true,
            err:{}
        })
    } catch (error) {
        return res.status(error.statusCode).json({
            message:error.message,
            data:{},
            success:false,
            err:error.explanation
        })
    }
}

const isAuthenticated=async(req,res)=>{
    try {
       const token=req.headers['x-access-token'];

       const response=await userService.isAuthenticated(token);
       return res.status(200).json({
            success:true,
            err:{},
            data:response,
            message:'User is authenticated amd token is valid'
       })
    } catch (error) {
        return res.status(500).json({
            message:'Something went wrong',
            data:{},
            success:false,
            err:error
        })
    }
}

const isAdmin=async(req,res)=>{
    try {
        const response=await userService.isAdmin(req.body.id);
       return res.status(200).json({
            data:response,
            err:{},
            success:true,
            message:'Succesfully fetched whether user is admin or not'
       })
    } catch (error) {
        return res.status(500).json({
            message:'Something went wrong',
            data:{},
            success:false,
            err:error
        })
    }
}
 // get
const getUser=async(req,res)=>{
        try {
            const user=await userService.getUser(req.params.id);
            return res.status(200).json({
            data:user,
            err:{},
            success:true,
            message:'Succesfully fetched user'
             })
        } catch (error) {
            return res.status(500).json({
            message:'Something went wrong',
            data:{},
            success:false,
            err:error
            })
        }
}
module.exports={
    createUser,
    signIn,
    isAuthenticated,
    isAdmin,
    getUser
}