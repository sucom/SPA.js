var Employee = function(name) {
  this.name = name;
  this.id;
};

Employee.prototype.showName = function() {
  return this.name;
};

var emp1 = new Employee("Mark");
var emp2 = new Employee("Jack");

console.log( emp1.showName() );
console.log( emp2.showName() );