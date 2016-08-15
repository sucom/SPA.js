var globalObj = {
  name: 'Javascript'
};

function changeName(localObj) {
  localObj.name = "Changed";
}

changeName(globalObj);

console.log(globalObj);