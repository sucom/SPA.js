//function can act as a "Class".
//However consider function as Constructor

var Employee = function(name) {
  this.name = name;
};

var emp1 = new Employee("Mark");

console.log( emp1 );

console.log( typeof Employee );

//console.log( typeof emp1 );