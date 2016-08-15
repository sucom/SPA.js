function doSomething(){
  
  console.log("No. of arguments: " + arguments.length);
  console.log(arguments);

}

doSomething();

doSomething("Hello", 123, {name:'something'}, true, [1,2,3]);