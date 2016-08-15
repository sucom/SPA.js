var globalObj = {
  name: 'Javascript'
};

var xObj = globalObj;

globalObj = null;
console.log(xObj);

//or

//xObj = null;
//console.log(globalObj);