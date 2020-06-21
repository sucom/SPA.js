spa.$('home', {
  style:'.',
  data: { name: 'home' },

  renderCallback: function(){
    var templateData = this.$data; //or app.home.$data
    console.log('Component home has been rendered with Data:', templateData);
  },

  doSomething: function(){
    //call app.home.doSomething();
  },

  events: [
    // { target: '#btnSubmit',
    //   onClick: function(){
    //     app.home.doSomething();
    //   }
    // }
  ]
});