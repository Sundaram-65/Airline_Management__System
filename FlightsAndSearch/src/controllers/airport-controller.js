const {AirportService}=require('../services/index');

const airportService=new AirportService();

const createAirport=async(req,res)=>{

    try {
        const response=await airportService.createAirport(req.body);
        return res.status(201).json({
            data:response,
            success:true,
            message:'Successfully added a airport',
            err:{}
        })
    } catch (error) {
        
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to create airport",
            err:error
        })
    }
}

// delete

const deleteAirport=async(req,res)=>{
    try {
        const response=await airportService.deleteAirport(req.params.id);
        return res.status(200).json({
            data:response,
            success:true,
            message:'Successfully deleted a airport',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to delete airport",
            err:error
        })
    }
}

// get

const getAirport=async(req,res)=>{
    try {
        const response=await airportService.getAirport(req.params.id);
        return res.status(200).json({
            data:response,
            success:true,
            message:'Successfully fetched a airport',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to fetched airport",
            err:error
        })
    }
}

//getAll

const getAllAirport=async(req,res)=>{
    try {
        const response=await airportService.getAllAirport()
        return res.status(200).json({
            data:response,
            success:true,
            message:'Successfully fetched a airport',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to fetched airport",
            err:error
        })
    }
}

//update

const updateAirport=async(req,res)=>{
    try {
        const response=await airportService.updateAirport(req.body,req.params.id);
        return res.status(200).json({
            data:response,
            success:true,
            message:'Successfully updated a airport',
            err:{}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to update airport",
            err:error
        })
    }
}
module.exports={
    createAirport,
    deleteAirport,
    getAirport,
    getAllAirport,
    updateAirport
}