var game = {
  data : {
    maxNumbers:9,
    maxLife:5,
    lifeLeft:0,
    stars:[],
    numbers:[],
    selected:[],
    used:[],
    btnDisableState:''
  },
  showStars: function(){
    game.data.stars = spa.range('1..'+(spa.rand(1, game.data.maxNumbers))); //generate Random Stars
    spa.render('#containerStars', {template:'#tmplStarList', data:game.data}); //Render
  },
  refreshStars:function(){
    game.data.lifeLeft--;
    var allSelected = $('.number.used').length==game.data.maxNumbers
      , isGameOver = (allSelected || (game.data.lifeLeft < -1));
    if (isGameOver) {
      game.finish();
    } else {
      $('#containerLifeLeft').html(game.data.lifeLeft+1);
      game.showStars();
      game.unselectNumbers();
    };
  },
  showNumbers: function(){
    spa.render('#containerNumbers', {template:'#tmplNumbers', data:game.data});
  },
  showSelected: function(){
    spa.render('#containerAnswer', {template:'#tmplSelectedList', data:game.data});
  },
  showBtn:function(btnState){
    var btnTemplate = '#tmplBtn_'+(btnState||'');
    game.data.btnDisableState = (game.data.selected.length==0)? 'disabled' : '';
    spa.render('#containerBtnCheck', {template:btnTemplate, data:game.data});
  },
  finish: function(){
    spa.render('#containerNumbers', {template:'#tmplGameOver', data:game.data});
  },
  selectNumber:function(selectedEl){
    $selectedEl = $(selectedEl);
    if (!$selectedEl.hasClass('selected')) {
      $selectedEl.addClass('selected');
      game.data.selected.push(spa.toInt($selectedEl.text()));
      game.showSelected();
      game.showBtn();
    };
  },
  checkAnswer: function() {
    var sumOfSelectedNumbers = game.data.selected.reduce(function(p,n) {return p+n;}, 0)
      , correct = ''+(game.data.stars.length === sumOfSelectedNumbers);
    game.showBtn(correct);
  },
  acceptAnswer:function(){
    _.remove(game.data.selected, function(n){
      $('#n_'+n).addClass('used');
      return true;
    });
    game.data.lifeLeft++;
    game.refreshStars();
  },
  unselectNumber:function(selectedNo){
    $('#n_'+selectedNo).removeClass('selected');
    $('#s_'+selectedNo).remove();
    _.pull(game.data.selected, selectedNo);
    game.showBtn();
  },
  unselectNumbers:function(){
    _.remove(game.data.selected, function(n){
      $('#n_'+n).removeClass('selected');
      return true;
    });
    $('#containerAnswer').empty();
    game.showBtn();
  },
  start: function(){
    game.data.lifeLeft = game.data.maxLife;
    game.selected = [];
    game.data.numbers = spa.range('1..'+game.data.maxNumbers);
    game.refreshStars();
    game.showNumbers();
    game.showBtn();
  }
};