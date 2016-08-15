var update = function (name, country) {
  this.name = name;
  this.country = country;
};

var obj1 = {
  name: ""
};

update.call(obj1, "NAME", "IN");

console.log(obj1);