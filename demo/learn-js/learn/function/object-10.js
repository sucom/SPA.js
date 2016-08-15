var obj0 = {
  name: "Jack"
};
console.log( obj0.__proto__ );
console.log( obj0.prototype );

var Employee = function(name) {
  this.name = name;
  this.id;
  this.doSomething = function() {};
};

//console.log( Employee.prototype );
//console.log( typeof Employee.prototype );

//console.log( Employee.prototype === Object.prototype );