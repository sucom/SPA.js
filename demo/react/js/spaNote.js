var _$  = document.querySelector.bind(document);
var _$$ = document.querySelectorAll.bind(document);

var note = {
    renderView: function(id) {
      spa.render({target:'#note_'+id, template:'#tmplNoteView', data:board.notes[id]});
    }
  , bringToFront:function(noteEl){
      $('.note').css('zIndex', 0);
      $(noteEl).css('zIndex', 10);
    }
  , renderNew: function() {
      var $newNote = $('#note_'+board.lastNote);
      $newNote.css({
            left: spa.rand(0, window.innerWidth - 200) + 'px',
            top: spa.rand(0, window.innerHeight - 200) + 'px',
            transform: 'rotate(' + spa.rand(-15, 15) + 'deg)'
        })
        .on('click', function(e){
          note.bringToFront(this);
        })
        .draggable();
      _$('#note_'+board.lastNote).scrollIntoView(true);
      note.renderView(board.lastNote);
    }
  , renderForm: function(id){
      spa.render({target:'#note_'+id, template:'#tmplNoteEdit', data:board.notes[id]});
    }
  , save: function(id){
      board.notes[id] = spa.serializeFormToObject('#formNoteEdit_'+id);
      note.renderView(id);
    }
  , remove: function(id){
      delete board.notes[id];
      $('#note_'+id).remove();
    }
};

var board = {
    notes:{}
  , lastNote:0
  , createNote:function(){
      board.lastNote++;
      board.notes[board.lastNote] = {id:board.lastNote, text:'New Note'};
    }
  , addNote: function(){
    board.createNote();
    spa.render({target:'#containerBoard', template:'#tmplNote', renderMode:'append', data:{id: board.lastNote}, renderCallback:note.renderNew});
  }
};