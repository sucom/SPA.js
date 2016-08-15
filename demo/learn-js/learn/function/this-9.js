var Employee = function (name) {
  this.name = name;
  
  var doSomething = function() {
    console.log(this);
  };

  doSomething();
};

var emp1 = new Employee("Andy");