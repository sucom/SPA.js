var _$  = document.querySelector.bind(document);
var _$$ = document.querySelectorAll.bind(document);

var appSettings = {
  langPath: 'demo/spa/language/'
};

//spa.debugger.on();

/* Initialize kRoutes */
spa.initRoutes({
    useHashRoute: true
  , defaultPageRoute : "#spa/home"
  , loadDefaultScript: false //default:true
//  , usePatterns: false //default:true
//  , beforeRoute : "appUiHelper.hideMenus"
//  , defaultTemplateExt : ".jsp" //default:".html"
//  , defaultRouteTargetContainerIdPrefix: "routeContainer_"
//  , defaultRouteTemplateContainerIdPrefix: "template_"
});

/* init SPA */
function initSPA() {
  // fix secondary menu when primary menu passed
  appUiHelper.secondaryMenu.init();

  // create sidebar and attach to menu in mobile view
  appUiHelper.sidebar.attach();
  
  appUiHelper.setLang("en_US");
}
