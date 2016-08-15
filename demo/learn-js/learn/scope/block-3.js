try {
  
  throw 1234;
  
} catch (e) {
  
  var vInsideCatch = "Inside Catch";

  console.log(e);
}

console.log(">>"+ vInsideCatch );

console.log("######");

console.log(e);