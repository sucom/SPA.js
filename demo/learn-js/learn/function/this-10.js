var Employee = function (name) {
  this.name = name;
  
  this.doSomething = function() {
    console.log(this);
  };

  this.doSomething();
};

var emp1 = new Employee("Andy");