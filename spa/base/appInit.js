var appSettings = {

};

//klib.debugger.on();

/* Initialize kRoutes */
klib.initRoutes({
    useHashRoute: true
  , defaultPageRoute : "#spa/home"
//  , usePatterns: false //default:true
  , loadDefaultScript: false //default:true
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
}
