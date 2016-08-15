try {
  
  throw new RangeError("Range Error Message");
  
  //throw new Error("Error Message");
  
  //throw "something";
  
} 
catch (e) {
  
  if (e instanceof RangeError) {
    
    console.log("Handle RangeError");
    
  } else if (e instanceof Error) {
    
    console.log("Handle Error");
    
  }
  
}