var Employee = function(name) {
  this.name = name;
};

var emp1 = new Employee("Mark");
var emp2 = new Employee("Mark");
var emp3 = new Employee("Jack");

console.log( emp1 );
console.log( emp2 );
console.log( emp3 );

console.log( emp1.__proto__ === emp3.__proto__ );