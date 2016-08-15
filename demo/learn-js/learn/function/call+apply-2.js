var name = "GlobalName";

var update = function (name) {
  this.name = name;
};

var obj1 = {
  name: "ObjectName"
};

update.call(obj1, "Changed");

//update.call(this, "Changed");
//update.call(null, "Changed");
//update.call({}, "Changed");

console.log("GlobalName: "+ name);
console.log("ObjectName: "+ obj1.name);