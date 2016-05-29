/* UI Helpers */
var appUiHelper = {
    modals: {
      hideAll: function(){
        $(".ui.modal").modal('hide all');
      }
    }

  , ctrlTabkey: function (){
      $(".top-bar").keydown(function(objEvent) {
        if (objEvent.keyCode == 9 && $(".ui.modal.visible.active").length) {  //tab pressed when ui modal window shown
          objEvent.preventDefault(); // stops its action
        }
      });
    }

  , activateMainContainer: function(activeContainer){
      $("#mainStage .mainContentContainer").removeClass("active");
      $("#mainStage .mainContentContainer."+activeContainer).addClass("active");
    }

  , menu: {
      activate: function(menuItemName){
        if (!menuItemName){
          menuItemName = ($("#mainStage h1").text() || "").replace(/[^a-z]/gi,"").toLowerCase();
        }
        $("a.menuItem").removeClass("active");
        try {
          $("a.menuItem."+menuItemName).addClass("active");
        } catch(e){
          spa.console.error("Error in finding Active Menu.\n" + e.stack);
        }
      }
    }

  , sidebar: {
        show: function(){
          $(".ui.sidebar").sidebar('show');
        }
      , hide: function(){
          $(".ui.sidebar").sidebar('hide');
        }
      , toggle: function(){
          $(".ui.sidebar").sidebar('toggle');
        }
      , attach: function(attachTo){
          $('.ui.sidebar').sidebar('attach events', (attachTo || '.toc.item'));
        }
    }

  , secondaryMenu: {
        show: function(){
          $('.fixed.menu').transition('fade in');
        }
      , hide: function(){
          $('.fixed.menu').transition('fade out');
        }
      , init: function(){
          $('#menuMainTop').visibility({
            once: false,
            onBottomPassed: function() {
              appUiHelper.secondaryMenu.show();
            },
            onBottomPassedReverse: function() {
              appUiHelper.secondaryMenu.hide();
            }
          });
        }
    }

  , sync:{
      menus: function(){
        appUiHelper.menu.activate();
        appUiHelper.sidebar.hide();
      }
    }
    
  , setLang: function(uLang) {
      if (!_.isString(uLang)) {
        uLang = _.last(spa.urlHash([]));
      };
      spa.i18n.setLanguage(uLang, {cache:true, async:true, path:appSettings.langPath});
    }
};
