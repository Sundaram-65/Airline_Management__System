const {StatusCodes}=require('http-status-codes');

class AppError extends Error{

    constructor(
        name,
        message='Something went wrong',
        explanation,
        statusCodes=StatusCodes.INTERNAL_SERVER_ERROR
    ){
        super();
        this.name=name;
        this.message=message;
        this.explanation=explanation;
        this.statusCodes=statusCodes
    }
}

module.exports=AppError