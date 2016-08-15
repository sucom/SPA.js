//spa.debugger.on();

var _$  = document.querySelector.bind(document);
var _$$ = document.querySelectorAll.bind(document);

var appSettings = {

};

/* Initialize kRoutes */
//spa.initRoutes({
//    useHashRoute: true
//  , defaultPageRoute : "#learn/home"
//  , loadDefaultScript: false //default:true
////  , defaultTemplateExt : ".jsp" //default:".html"
////  , usePatterns: false //default:true
////  , beforeRoute : "appUiHelper.hideMenus"
////  , defaultRouteTargetContainerIdPrefix: "routeContainer_"
////  , defaultRouteTemplateContainerIdPrefix: "template_"
//});

var defaultMode = "js"
  , langModes = {"js": "javascript", "html": "htmlmixed"}
  , editorConfig = {mode: langModes[defaultMode], lineNumbers: true, matchBrackets: true}
  , code
  , codeMode
  , $containerView
  , $containerScriptRun;

function updateCode(newCode) {
  code.setValue(newCode);
  if ($("#chkBxAutoRun").is(":checked")) {
    run[codeMode].call(window);
  } else {
    runInSandbox("");
  }
}
function changeMode(newMode) {
  codeMode = newMode;
  code.setOption("mode", langModes[newMode]);
  if (codeMode.equalsIgnoreCase("js")) {
    $("#containerView").addClass("hide");
  } else {
    $("#containerView").removeClass("hide");
  }
  $("#btnRunJs").attr("disabled", !codeMode.equalsIgnoreCase("js"));
}

function runInSandbox(sandboxCode){
  if ($("#chkBxClearConsole").is(":checked")) console.clear();
  $containerView.html("");
 if (!spa.isBlank(sandboxCode)) { 
   $containerView.append("<iframe name='_CODE_RUN_CONTAINER' id='_CODE_RUN_CONTAINER'></iframe>");
   window.frames['_CODE_RUN_CONTAINER'].document.write(sandboxCode);
 }
}
function openSrc(){
  var path = spa.urlHash();
  if (path) {
    if ($("#chkBxClearConsole").is(":checked")) console.clear();
    $containerView.html("");
    $containerView.append("<iframe name='_CODE_RUN_CONTAINER' id='_CODE_RUN_CONTAINER' src='"+(path+"."+codeMode)+"'></iframe>");
    //runInSandbox(code.getValue());
  };
}
function runJS() {
  if (codeMode.equalsIgnoreCase("js")) {
    var jsCode = "<html><body><script>"+code.getValue()+"</script></body></html>";
    runInSandbox(jsCode);
  }
}

var run = {
  js: runJS,
  html: openSrc
};

function navigateExamples(dir){
  var $containerLessons = $("#containerLessons")
    , $LessonsLinks     = $containerLessons.find("a")
    , $activeLessonLink = $containerLessons.find("a.active")
    , curLesson, $LessonsLinks, maxLessons, reqLessonIndex;
  if ($activeLessonLink.length) {
    curLesson      = spa.toInt($activeLessonLink.html());
    maxLessons     = $LessonsLinks.length;
    reqLessonIndex = (curLesson + dir) - 1;
    if ($LessonsLinks[reqLessonIndex]) { 
      $LessonsLinks[reqLessonIndex].click(); 
    } else {
      var activeLessonHash = $activeLessonLink.attr('href')
        , lessonTopicHash = activeLessonHash.replace(/-(.*)$/, "");
      if (dir < 0) {
        $("#containerToc").find("a[href='"+lessonTopicHash+"']")[0].click();
      } else {
        navTopicNext();
      };
    }
  } else {
    if (dir>0) {
      if ($LessonsLinks.length) {
        $containerLessons.find("a")[0].click();
      } else {
        navTopicNext();
      }
    } else {
      navTopicPrev();
    }
  };
}

function navTopicPrev(){
  var $activeTopic = $("#containerToc").find("a.active")
    , elPrevTopic = $activeTopic.prev("a")[0] || $activeTopic.prev().prev("a")[0];
  if (elPrevTopic) { 
    elPrevTopic.click();
  } else {
    $("#containerToc").find("a").removeClass("active");
    $("#nav").find("a")[0].click();
  };
}

function navTopicNext(){
  var $activeTopic = $("#containerToc").find("a.active")
    , elNextTopic = $activeTopic.next("a")[0] || $activeTopic.next().next("a")[0];
  if (elNextTopic) { 
    elNextTopic.click(); 
  } else {
    $("#containerToc").find("a").removeClass("active");
    $("#nav").find("a")[0].click();
  };
}

/* init SPA */
function initSPA() {
  $containerView = $("#containerView");
  $containerScriptRun = $("#containerScriptRun");
  code = CodeMirror(_$("#containerCode"), editorConfig);
}

function reloadSPA() {
  spa.render("#containerToc", {dataTemplatesCache:false});
}
