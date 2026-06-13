const express=require('express');

const UserController=require('../../controllers/user-controller') 
const {AuthRequestValidators}=require('../../middlewares/index');
const router=express.Router();

router.post('/signup',AuthRequestValidators.validateUserAuth,UserController.createUser);
router.post('/signin',AuthRequestValidators.validateUserAuth,UserController.signIn);
router.get('/isAuthenticated',UserController.isAuthenticated);
router.get('/isadmin',AuthRequestValidators.validateIsAdmin,UserController.isAdmin);
router.get('/user/:id',UserController.getUser);

router.get('/dummy',(req,res)=>{
    return res.status(200).json({message:'OK'})
})
module.exports=router


