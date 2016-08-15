var update = function (name, country) {
  this.name = name;
  this.country = country;
};

var obj1 = {
  name: ""
};

update.apply(obj1, ["NAME", "IN"]);

console.log(obj1);