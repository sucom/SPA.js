spa.console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo scripts loaded.");

function closeMemberListView()
{ $('#viewMemberList').html('');
}

function closeMemberDetailsView()
{ $("#container_viewMemberDetails").hide();
}

function closeMemberDetailsEdit()
{ $("#container_editMemberDetails").hide();
}

function clearViews()
{ closeMemberListView();
  closeMemberDetailsView();
  closeMemberDetailsEdit();
}