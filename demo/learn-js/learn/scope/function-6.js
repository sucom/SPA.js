
function mainFunction() {

  console.log("inside mainFunction");

  var innerFunction1 = function(){
    console.log("inside innerFunction1");
  };

  mainFunction.innerFunction1 = innerFunction1;
}

mainFunction();

mainFunction.innerFunction1();
