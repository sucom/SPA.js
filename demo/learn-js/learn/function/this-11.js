var Employee = function (name) {
  this.name = name;
};

Employee.prototype.doSomething = function(){
  console.log( this );
};

var emp1 = new Employee("Andy");
emp1.doSomething();