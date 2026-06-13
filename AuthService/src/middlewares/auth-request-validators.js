
const validateUserAuth=(req,res,next)=>{

    if((!req.body.email || !req.body.password)){

        return res.status(400).json({
            success:false,
            data:{},
            message:'Something went wrong',
            err:'Email or password missing in request'
        })
    }
    next();
}
const validateIsAdmin=(req,res,next)=>{

    if(!req.body.id){
        return res.status(400).json({
            success:false,
            data:{},
            message:'Something went wrong',
            err:'Userid is missing in request'
        })
    }
    next();
}
module.exports={
    validateUserAuth,
    validateIsAdmin
}