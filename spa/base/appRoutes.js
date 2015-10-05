/*
* contains:
* - Pattern Routes Registration
* - Route before functions
* - Route functions
* - Optional Route renderCallback functions
* */
//spa.routePatterns.register([]);

/* Default Render Callback */
klib.routes._renderCallback = function(){
  klib.console.log(arguments);
};

klib.routes.spa_home_renderCallback = function(){
  klib.console.log("Home callback");
  appUiHelper.sync.menus();
};

klib.routes.spa_getStarted_renderCallback = function(){
  klib.console.log("GetStarted callback");
  appUiHelper.sync.menus();
};

klib.routes.spa_doc_renderCallback = function(){
  klib.console.log("Home callback");
  appUiHelper.sync.menus();
};

klib.routes.spa_example_renderCallback = function(){
  klib.console.log("Home callback");
  appUiHelper.sync.menus();
};

