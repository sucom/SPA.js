/*
* contains:
* - Pattern Routes Registration
* - Route before functions
* - Route functions
* - Optional Route renderCallback functions
* */
//spa.routePatterns.register([]);

/* Default Render Callback */
spa.routes._renderCallback = function(){
  spa.console.log(arguments);
  appUiHelper.sync.menus();
};

spa.routes.spa_home_renderCallback = function(){
  spa.console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>Home callback", arguments);
  //appUiHelper.sync.menus();
};

spa.routes.spa_getStarted_renderCallback = function(){
  spa.console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>GetStarted callback", arguments);
  //appUiHelper.sync.menus();
};

spa.routes.spa_doc_renderCallback = function(){
  spa.console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>Doc callback", arguments);
  //appUiHelper.sync.menus();
};

spa.routes.spa_demo_renderCallback = function(){
  spa.console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>Demo callback", arguments);
  //appUiHelper.sync.menus();
};

