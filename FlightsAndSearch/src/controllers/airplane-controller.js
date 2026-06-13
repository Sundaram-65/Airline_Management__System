const {AirplaneService}=require('../services/index');

const airplaneService=new AirplaneService();

// create
const createAirplane=async(req,res)=>{
    try {
        const response=await airplaneService.createAirplane(req.body);
        return res.status(201).json({
            data:response,
            success:true,
            message:'Successfully added a airplane',
            err:{}
        })
    } catch (error) {
         return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to create airplane",
            err:error
        })
    }
}

// delete
const deleteAirplane=async(req,res)=>{
    try {
        const response=await airplaneService.deleteAirplane(req.params.id);
        return res.status(201).json({
            data:response,
            success:true,
            message:'Successfully deleted a airplane',
            err:{}
        })
    } catch (error) {
         return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to delete airplane",
            err:error
        })
    }
}

// get

const getAirplane=async(req,res)=>{
    try {
        const response=await airplaneService.getAirplane(req.params.id);
        return res.status(201).json({
            data:response,
            success:true,
            message:'Successfully fetched a airplane',
            err:{}
        })
    } catch (error) {
         return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to fecth airplane",
            err:error
        })
    }
}

// update

const updateAirplane=async(req,res)=>{
    try {
        const response=await airplaneService.updateAirplane(req.body,req.params.id);
        return res.status(201).json({
            data:response,
            success:true,
            message:'Successfully updated a airplane',
            err:{}
        })
    } catch (error) {
         return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to update airplane",
            err:error
        })
    }
}

module.exports={
    createAirplane,
    deleteAirplane,
    getAirplane,
    updateAirplane
}
