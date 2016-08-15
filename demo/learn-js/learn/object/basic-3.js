var actions = {
    name:'ActionName'
  , runCount: 0

  , update: function() {
      console.log("updating: "+ this.name);
      this.runCount++;
      this['release']++;
    }
};

var project = {
    name          : "Whatzapp"
  , teamSize      : 200
  , release       : 10
  , updateRelease : actions.update
};

console.log(actions);
console.log(project);
project.updateRelease();
console.log(actions);
console.log(project);