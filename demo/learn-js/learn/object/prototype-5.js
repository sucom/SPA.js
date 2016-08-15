var project = {
    name          : ""
  , teamSize      : 0
  , release       : 0
};

var project1 = Object.create(project);

console.log( project1.__proto__ === Object.prototype );

console.log( project1.__proto__.__proto__ === Object.prototype );