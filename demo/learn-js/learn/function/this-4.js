function update() {
  
  console.log( this );
  
  var doSomething = function(){
    
    console.log( this );
    
  };
  
  doSomething();
  
}

update();