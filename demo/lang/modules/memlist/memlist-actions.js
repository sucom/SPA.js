function viewMemberDetails(memId)
{ $("#container_editMemberDetails").hide();
  $("#container_viewMemberDetails").show();

  $("#viewMemberDetails").data("url", "demo/lang/api/member/get-"+memId+".json");
  $("#viewMemberDetails").data("cache", "true");
  spa.render("#viewMemberDetails");
}

function editMemberDetails(memId)
{ $("#container_viewMemberDetails").hide();
  $("#container_editMemberDetails").show();

  spa.render("#editMemberDetails", {dataUrl: "demo/lang/api/member/get-"+memId+".json"});
}

function removeMemberDetails(memId)
{
}
