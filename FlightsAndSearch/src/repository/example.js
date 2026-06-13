const CrudRepository=require('./crud-repository');

class AirportRepository extends CrudRepository{

    constructor(){
        super(model_name);
    }
}

// now we can access function create,delete,and all 