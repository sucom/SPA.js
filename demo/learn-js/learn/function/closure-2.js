var MainFunction = function (value) {
  var iValue = value;
  
  var updateValue = function() {
    iValue += 10;
    return iValue;
  };
  
  return updateValue;
};

var fnUpdate = MainFunction(0);
console.log( typeof fnUpdate );

console.log( fnUpdate() );
console.log( fnUpdate() );
console.log( fnUpdate() );