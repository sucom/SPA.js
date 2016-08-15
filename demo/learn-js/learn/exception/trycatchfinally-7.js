var errorHandle = function( e ) {
  
  console.log("Handling Uncaught Errors here.");
  console.log(e);

}

window.onerror = errorHandle;

throw "something";
