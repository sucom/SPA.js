// @spa$:home

// private properties

var _data = { name: 'home' };

var _renderCallback = function () { // DO NOT USE ARROW FUNCTION
  var templateData = this.$data; // or app.home.$data

  console.log('Component home has been rendered with Data:', templateData);

  doSomething();
};

var _events = [
  // { target: '#btnSubmit',
  //   onClick: function () { // DO NOT USE ARROW FUNCTION
  //     doSomething();
  //   }
  // }
];

// local variables and functions

function doSomething () {
  console.log('Doing Something...');
}


// export local variables or functions as properties accessible through home component:home as app.home.actionX();
var props = {

  actionX: doSomething

};