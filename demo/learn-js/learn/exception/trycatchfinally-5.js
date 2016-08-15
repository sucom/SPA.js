function handleErrors( e ){
  
  switch ( true ) {

    case (e instanceof RangeError):
      console.log("Handle RangeError");
      break;
    
    case (e instanceof Error):
      console.log("Handle Error");
      break;
      
    default:
      console.log("Unknown Error");
      console.log( e );
  }

}

try {
  
  throw new RangeError("Range Error Message");
  
  //throw new Error("Error Message");
  
  //throw "something";

} 
catch (e) {
  handleErrors( e );
}