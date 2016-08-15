var Employee = function (name) {
  console.log(this);
    
  this.name = name;
};

var emp1 = new Employee("Andy");