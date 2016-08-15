var Employee = function(name) {
  this.name = name;
  this.id;
};

Employee.prototype.doSomething = function() {
  return true; 
};

var emp1 = new Employee("Mark");
console.log( emp1.doSomething() );

Employee.prototype.doSomething = function() {
  return false; 
};

var emp2 = new Employee("Jack");
console.log( emp2.doSomething() );

//console.log( emp1.doSomething() );