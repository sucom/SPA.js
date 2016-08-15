try {
  
  throw "some error";
  
} 
catch (e) {
  
  console.log( e );
  
}
finally {
  
  console.log("Finally done.");
  
}