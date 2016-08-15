/*
* contains:
* - Pattern Routes Registration
* - Route before functions
* - Route functions
* - Optional Route renderCallback functions
* */
//spa.routePatterns.register([]);

/* Default Render Callback */
var lastRenderData;
spa.routes._renderCallback = function(data){
  lastRenderData = data;
  //console.log(data);
  var linkHash = "#"+spa.urlHash();
  if (spa.hasKey(data, "iOptions.rElRouteOptions.target")) { 
    var $containerToc = $("#containerToc")
      , elNavLink = $containerToc.find("a[href='"+linkHash+"']").get(0);
    if (elNavLink) {
      appUiHelper.activateNavLink(elNavLink);
      appUiHelper.buildLessons(elNavLink);
    } else {
      var $containerLessons = $("#containerLessons");
      $containerLessons.find("a").removeClass("active");
      $containerLessons.find("a[href='"+linkHash+"']").addClass("active");
    };
    changeMode((data.iOptions.rElRouteOptions['ext'] || "js").trimLeftStr('.'));
    updateCode(data.view);
  };
};


spa.routes.learn_home_renderCallback = function(){

};

var renderCallback = {
  toc: function () {
    $("#containerToc").find("a.html").attr("data-sparoute", "target:'#containerCodeBase',ext:'.html',tmplEngine:'none'");
    $("#containerToc").find("a:not([class])").attr("data-sparoute", "target:'#containerCodeBase',ext:'.js',tmplEngine:'none'");
  }
}

var appUiHelper = {
  activateNavLink: function(elNavLink){
      $("#containerToc").find("a").removeClass("active");
      $(elNavLink).addClass("active");
  }
  , buildLessons: function (elNavLink) {
      var linkHash     = "#"+(spa.urlHash()).replace(/(.*)\.(.*?)$/, "$1")
        , $elNavLink   = $(elNavLink)
        , lessonsCount = spa.toInt($elNavLink.data("lessons"))
        , lessonsLinks = ""
        , lessonsType = $(elNavLink).data("lessionsType");
      for (var i = 1; i <= lessonsCount; i++) {
        if (lessonsType) {
          lessonsLinks += " <a href='" + (linkHash.replace(/-(.*)$/, "")) + "-" + i + "' data-sparoute=\"target:'#containerCodeBase',ext:'."+lessonsType+"',tmplEngine:'none'\"> " + i + " </a> ";
        } else {
          lessonsLinks += " <a href='" + (linkHash.replace(/-(.*)$/, "")) + "-" + i + "' data-sparoute=\"" + $elNavLink.data("sparoute") + "\"> " + i + " </a> ";
        };
      }
      $("#containerLessons").html(lessonsLinks.ifBlankStr("", "Examples: "+lessonsLinks));
    }
};