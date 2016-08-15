var Employee = function(name) {
  this.name = name;
  
  this.applyLeave = function( days ){
    return true;
  };

};

var emp1 = new Employee("Mark");
var emp2 = new Employee("Mark");

console.log( emp1 );
console.log( emp2 );

console.log( emp1.name === emp2.name );

console.log( emp1.applyLeave === emp2.applyLeave );