function doSomething(actionA, actionB) {
  console.log("called: doSomething(actionA, actionB)");
}

function doSomething(actionA) {
  console.log("called doSomething(actionA)");
}

doSomething("run");

//doSomething("run", "fly");