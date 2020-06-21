// @spa$:componentXpath

/* private properties */

var _dataUrl = '';

var _renderCallback = function () { // DO NOT USE ARROW FUNCTION
  var templateData = this.$data; // or app.componentX.$data

  console.log('Component componentX has been rendered with Data:', templateData);

  doSomething();
};

// var _events = [
//   { target: '#btnSubmit',
//     onClick: function () { // DO NOT USE ARROW FUNCTION
//       doSomething();
//     }
//   }
// ];

/* local variables and functions */

function doSomething () {
  console.log('Doing Something...');
}

/* export local variables or functions as properties accessible through component:componentX as app.componentX.actionX(); */
var prop = {

  actionX: doSomething

};