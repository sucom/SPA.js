 
console.log ( (new String).trim );
 
console.log ( (new String).isBlank );
 
if ( !(new String).isBlank ) {
 String.prototype.isBlank = function () {
    return (this.trim() === "");
  };
}

console.log( "".isBlank() );

console.log( "    ".isBlank() );

console.log( "javascript".isBlank() );