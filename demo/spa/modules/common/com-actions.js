function closeMemberListView()
{ $('#viewMemberList').html('');
}

function closeMemberDetailsView()
{ $("#viewMemberDetails").hide();
}

function closeMemberDetailsEdit()
{ $("#editMemberDetails").hide();
}

function clearViews()
{ closeMemberListView();
  closeMemberDetailsView();
  closeMemberDetailsEdit();
}