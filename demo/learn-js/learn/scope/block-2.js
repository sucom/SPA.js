try {
  
  throw 1234;
  
} catch (e) {
  
  vInsideCatch = "Inside Catch";
  
  console.log(e);
}

console.log(">>"+ vInsideCatch );

console.log("######");

console.log(e);