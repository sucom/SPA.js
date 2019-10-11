spa.$('componentX', {
  style:'.',
  data: { name: 'componentX' },

  //dataUrl: '', //use this property for external data source instead of above static data property

  renderCallback: function(){
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