var MainFunction = function (value) {
  var iValue = value;
  
  var updateValue = function() {
    iValue += 10;
    return iValue;
  };
  
  return updateValue();
};

console.log( MainFunction(0) );
console.log( MainFunction(0) );
console.log( MainFunction(0) );