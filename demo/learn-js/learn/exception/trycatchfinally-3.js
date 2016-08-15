try {
  
  throw new Error("Error Message")
  
} 
catch (e) {
  
  console.log( e.name + ": " + e.message );
  
}