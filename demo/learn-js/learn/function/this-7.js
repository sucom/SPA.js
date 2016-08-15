var Employee = function (name) {
  this.name = name;
  
  console.log(this);
};

var emp1 = new Employee("Andy");