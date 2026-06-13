const {FlightService}=require('../services/index')
const {SuccessCodes}=require('../utils/error-codes')
const flightService=new FlightService();

//create
const createFlight=async (req,res)=>{
    try {
        const response=await flightService.createFlight(req.body);
        return res.status(SuccessCodes.CREATED).json({
            data:response,
            success:true,
            message:'Successfully added a flight',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to create flight",
            err:error
        })
    }
}

// delete
const deleteFlight=async (req,res)=>{
    try {
        const response=await flightService.deleteFlight(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data:response,
            sucess:true,
            message:'Successfully deleted a flight',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to delete flight",
            err:error
        })
    }
}

//get 
const getFlight=async (req,res)=>{
    try {
        const response=await flightService.getFlight(req.params.id);
        return res.status(200).json({
            data:response,
            sucess:true,
            message:'Successfully fetched a flight',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to fetch flight",
            err:error
        })
    }
}
const getAllFlight=async (req,res)=>{
    try {
        const response=await flightService.getAllFlight(req.query);
        return res.status(200).json({
            data:response,
            sucess:true,
            message:'Successfully fetched a flight',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to fetch flight",
            err:error
        })
    }
}

// update
const updateFlight=async (req,res)=>{
    try {
        const response=await flightService.updateFlight(req.body,req.params.id);
        return res.status(200).json({
            data:response,
            sucess:true,
            message:'Successfully updated a flight',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to update flight",
            err:error
        })
    }
}



module.exports={
    createFlight,
    deleteFlight,
    getFlight,
    updateFlight,
    getAllFlight
}