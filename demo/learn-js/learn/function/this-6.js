var obj1 = {
    name: "Object-1"
    
  , doSomething: function(){

      var doMore = function() {
        console.log(" inside doMore ");
        console.log( this );
      };

      doMore();
    }
};

obj1.doSomething();