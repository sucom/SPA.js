var obj1 = {
    name: "Object-1"
    
  , doSomething: function(){
      console.log( this );
    }
};

obj1.doSomething();