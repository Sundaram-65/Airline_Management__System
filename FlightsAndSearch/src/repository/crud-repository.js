
class CrudRepository{
    
    constructor(model){
        this.model=model;
    }

    // create
    async create(data){
        try {
            const result=await this.model.create(data);
            return  result;
        } catch (error) {
            console.log('Something went wrong in crud-repo');
            throw error;
        }
    } 

    // delete
    async delete(modelId){

        try {
            const result =await this.model.destroy({
                where:{
                    id:modelId
                }
            });
            return result;
        } catch (error) {
            console.log('Something went wrong in crud-repo');
            throw error;
        }
    }

    // get
    async get(modelId){

        try {
            const result =await this.model.findByPk(modelId);
            return result;
        } catch (error) {
            console.log('Something went wrong in crud-repo');
            throw error;
        }
    }
    // getAll
    async getAll(){

         try {
            const result =await this.model.findAll();
            return result;
        } catch (error) {
            console.log('Something went wrong in crud-repo');
            throw error;
        }
    }

    // update
    async update(data,modelId){

         try {
            const result =await this.model.update(data,{
                where:{
                    id:modelId
                }
            });
            return result;
        } catch (error) {
            console.log('Something went wrong in crud-repo');
            throw error;
        }
    }
}
module.exports=CrudRepository