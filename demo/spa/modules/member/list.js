spa.routePatterns.register([
  
  { name:"memberDetailsView", pattern:"#demo/spa/modules/member/view?id=:memid", routeoptions:{
        target:"#viewMemberDetails"
      , dataUrl:"demo/spa/api/member/get-{memId}.json"
      , before: function(){
        $("#container_editMemberDetails").hide();
        $("#container_viewMemberDetails").show();
      }
  }}
  
]);

//spa.routes.demo_spa_modules_member_view = function(){
//  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//  console.log(arguments);
//}

function viewMemberDetails(memId)
{ $("#container_editMemberDetails").hide();
  $("#container_viewMemberDetails").show();

  $("#viewMemberDetails").data("url", "demo/spa/api/member/get-"+memId+".json");
  //$("#viewMemberDetails").data("cache", "true");
  spa.render("#viewMemberDetails");
}

function editMemberDetails(memId)
{ $("#container_viewMemberDetails").hide();
  $("#container_editMemberDetails").show();

  spa.render("#editMemberDetails", {dataUrl: "demo/spa/api/member/get-"+memId+".json"});
}

function removeMemberDetails(memId)
{
}
