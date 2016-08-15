var actions = {
    name:'ActionName'
  , runCount: 0

  , update: function() {
      console.log("updating: "+ this.name);
      this.runCount++;
      this['release']++;
    }
};

console.log(actions);
actions.update();
console.log(actions);