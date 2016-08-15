var Employee = function(name) {
  this.name = name;
  this.id;
};

Employee.prototype.doSomething = function() {};

var emp1 = new Employee("Mark");
var emp2 = new Employee("Jack");

console.log( emp1 === emp2 );
console.log( emp1.doSomething() === emp2.doSomething() );