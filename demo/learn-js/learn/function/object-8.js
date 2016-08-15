var Employee = function(name) {
  this.name = name;
  
  this.applyLeave = function( days ){
    return true;
  };

};

var emp1 = new Employee("Mark");
var emp2 = new Employee("Mark");

console.log( emp1.applyLeave(1) );

Employee.applyLeave = function( days ) {
  return false;
};

console.log( emp1.applyLeave(1) );
console.log( emp2.applyLeave(1) );

var emp3 = new Employee("Mark");
console.log( emp3.applyLeave(1) );

console.log( Employee.applyLeave(1) );
