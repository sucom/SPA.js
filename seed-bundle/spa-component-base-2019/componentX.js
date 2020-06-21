spa.$('componentXpath', {
  //style:'.', // Enable only if this component has specific styles in componentXpath/componentXfile.css

  target: '#targetContainer',

  data: { name: 'componentX' },
  //dataUrl: '', // use this property for external data source instead of above static data property

  renderCallback: function(){
    // function called after this component is rendered.

    var templateData = this.$data; //or app.componentX.$data
    console.log('Component componentX has been rendered with Data:', templateData);
  },

  doSomething: function(){
    //call app.componentX.doSomething();
  },

  events: [
    // { target: '#btnSubmit',
    //   onClick: function(){
    //     app.componentX.doSomething();
    //   }
    // }
  ]
});