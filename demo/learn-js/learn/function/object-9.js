var Employee = function(name) {
  var _id = 0;
  
  var _doSomething = function(){
    console.log("doing something...");
  };
  
  this.name = name;
  
  this.applyLeave = function( days ){
    
    _doSomething();
    
    return true;
  };

};

var emp1 = new Employee("Mark");
console.log( emp1.applyLeave(1) );

Employee.applyLeave = function( days ) {
  return false;
};
console.log( "Employee.applyLeave has been modified." );

var emp2 = new Employee("Jack");
console.log( emp2.applyLeave(1) );

console.log( Employee.applyLeave(1) );

console.log( Employee._doSomething() );
//console.log( emp1._doSomething() );