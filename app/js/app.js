function updateGAPageView(){ga('send', 'pageview', { page: ('/'+spa.urlHash()) });}
setInterval(updateGAPageView, 90000);
spa.onInit = function(){
  spa.defaults.set( {components: {inFolder: false, scriptExt:'', templateScript:true }} );
};

hljs.configure({useBR:true, tabReplace:'  '});
/* ----------------------------------- */
spa.$extend('main', {
  renderCallback: function(){
    this.loadMainComponent();
  },
  loadMainComponent: function(){
    var compName = spa.ifBlank(spa.urlHash([])[0], 'home');
    if (!$('.container_'+compName).length) {
      if (compName === 'home') {
        $('body').addClass('home');
      } else {
        $('body').removeClass('home');
      }
      spa.$render( compName, { target: '#mainContainer' } );
    } else {
      app[compName].renderCallback();
    }
    this.showActive();
  },
  showActive: function(){
    var compName = spa.ifBlank(spa.urlHash([])[0], 'home');
    $('.navbar .navbar-nav a[href="#'+compName+'"]').parent().addClass('active').siblings().removeClass('active');
    this.hideTopMenu();
  },
  hideTopMenu: function(){
    $('#navbarCollapse').removeClass('show');
  }
});
/* ----------------------------------- */
spa.onUrlHashChange = function(){
  app.main.loadMainComponent();
  updateGAPageView();
};
/* ----------------------------------- */
spa.$extend('getStarted', {
  renderCallback: function(){
    spa.$render(spa.ifBlank(spa.urlHash([])[1], 'folderStructure'), {
      target: '#docContainer',
      skipDataBind:true,
      renderCallback:function(){
          app.getStarted.formatCode();
        }
      });
    app.sidebar.showActive();
  },
  activateNavBtns:function(){
    var menuItems = app.sidebar.menus,
    curIndex = menuItems.indexOf('#'+spa.urlHash());
    $('#btnDocNavPrev').prop('disabled', (curIndex<=0));
    $('#btnDocNavNext').prop('disabled', (curIndex>=(menuItems.length-1)));
  },
  navigate:function(direction){
    var menuItems = app.sidebar.menus;
    if (!spa.isBlank(menuItems)) {
      var curIndex = menuItems.indexOf('#'+spa.urlHash()),
          reqIndex = (curIndex<0? 0 : curIndex) + (direction);
          reqIndex = (reqIndex<0)? 0 : ((reqIndex>=menuItems.length)? (menuItems.length-1) : reqIndex);
      var targetHash = menuItems[reqIndex];
      var elMenu = $('#sidebar-nav a[href="'+targetHash+'"]')[0];
      if (elMenu) { elMenu.scrollIntoView(); elMenu.click(); }
    }
  },
  formatCode:function(){
    hljs.formatCodesInScript();
  },
  events: [
    { target: 'button[data-dir]',
      onClick: function() {
        app.getStarted.navigate( ($(this).data('dir') * 1) );
      }
    }
  ]
});
/* ----------------------------------- */
spa.$extend('sidebar', {
  menus: [],
  renderCallback: function(){
    this.menus = $('#sidebar-nav a[href^="#getStarted/"]').map( function(i, a){ return $(a).attr('href'); } ).toArray();
    this.showActive();
  },
  showActive: function(){
    app.getStarted.activateNavBtns();
    var compName = spa.ifBlank(spa.urlHash([])[1], 'folderStructure');
    $('#sidebar-nav li.active').removeClass('active');
    $('#sidebar-nav a[href="#getStarted/' + compName + '"]').parent().addClass('active');
    this.hideSideBar();
  },
  hideSideBar:function(){
    $('#sidebar').removeClass('show');
  }
});
/* ----------------------------------- */
function submitFeedback() {
  $('#feedbackReqId').val(spa.now());
  var formData = spa.serializeFormToSimpleObject( '#feedbackForm' );
  if (formData.n && formData.e && formData.s && formData.m) {
    $('#feedbackResponseMsg').html('Processing ...');
    spa.api.post('https://uxperience.live/contact/spajs/api/', formData).then(function(apiRes){
      $('#feedbackResponseMsg').html('Thank you for the message. The team will get back to you soon.');
      $('#feedbackForm')[0].reset();
      $('#feedbackForm #contactName')[0].focus();
    }).fail(function(){
      $('#feedbackResponseMsg').html('Unable to process your request now. Please try again later.');
    });
  }
}
