var project = new Object();

project.name       = "Whatzapp";
project.startDate  = "2013-01-01";
project.teamSize   = 200;
project['release'] = 10;

project.updateRelease = function() {
  this.release++;
};

console.log(project);

project['updateRelease']();

console.log(project);