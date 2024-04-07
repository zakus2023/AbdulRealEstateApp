export const errorHandler = (statusCode, message)=>{
    const error = new Error(); // using nodejs error constructor
    error.statusCode = statusCode;
    error.message = message;
    return error;
    
}