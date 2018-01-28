spa.$('componentX', {
  style:'.',
  data: { name: 'componentX' }
});

spa.$extend('componentX', {
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