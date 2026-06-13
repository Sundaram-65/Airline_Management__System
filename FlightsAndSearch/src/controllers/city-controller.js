const {CityService}=require('../services/index');

const cityService=new CityService();

const create = async(req,res)=>{

    try {
        const city =await cityService.createCity(req.body)
  
        return res.status(201).json({
            data:city,
            success:true,
            message:'Successfully created a city',
            err:{}
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to create city",
            err:error
        })
    }
}
// DELETE :/city/:id
const destroy =async(req,res)=>{

    try {
        const response =await cityService.deleteCity(req.params.id)
        return res.status(200).json({
            data:response,
            success:true,
            message:'Successfully deleted a city',
            err:{}
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to delete city",
            err:error
        })
    }
    
}
// Patch:/city/:id 
const update =async(req,res)=>{

   try {
        const city =await cityService.updateCity(req.body,req.params.id)
        return res.status(201).json({
            data:city,
            success:true,
            message:'Successfully updated city',
            err:{}
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to update city",
            err:error
        })
    }
    
}
// get :/city/:id
const get =async(req,res)=>{

    try {
        const response =await cityService.getCity(req.params.id)
        return res.status(200).json({
            data:response,
            success:true,
            message:'Successfully fetched a city',
            err:{}
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to get city",
            err:error
        })
    }
    
}
const getAll =async (req,res)=>{

    try {
        
        console.log(req.query);
        const response=await cityService.getAllCities(req.query);
        
        return res.status(200).json({
            data:response,
            success:true,
            message:'Successfully fetched a city',
            err:{}
        })
       
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to get cities",
            err:error
        })

    }

}

const addMulCities= async (req,res)=>{

        try {
            const response=await cityService.addMultipleCities(req.body.cities);
            return res.status(201).json({
                data:response,
                success:true,
                message:'Successfully added a city',
                err:{}
            })
        } catch (error) {
            console.log('Not able to add multiple cities');
            throw error;
        }
    }

    const getAllairports= async (req,res)=>{

        try {
            const response=await cityService.getAllairports(req.params.id);
            return res.status(201).json({
                data:response,
                success:true,
                message:'Successfully fetched airports',
                err:{}
            })
        } catch (error) {
            console.log('Not able to fetch airports');
            throw error;
        }
    }

module.exports={
    create,
    destroy,
    update,
    get,
    getAll,
    addMulCities,
    getAllairports
}