if (hljs) {
  hljs['formatCodesInScript'] = function(){
    $('script.code:not(.formatted)').each(function(idx, el){

      var rxLHB = new RegExp('<span class="hljs-tag">&lt;<span class="hljs-name">hl</span>&gt;</span>' , 'g'),
          rxLHE = new RegExp('<span class="hljs-tag">&lt;/<span class="hljs-name">hl</span>&gt;</span>', 'g'),
          rxLNB = new RegExp('<span class="hljs-tag">&lt;<span class="hljs-name">LN</span>&gt;</span>' , 'g'),
          rxLNE = new RegExp('<span class="hljs-tag">&lt;/<span class="hljs-name">LN</span>&gt;</span>', 'g'),
          $el = $(el),
          $data = $el.data(),
          codeId = $el.attr('id') || ((((new Date()).getTime())+'_'+(Math.random())).replace(/[^0-9]/g,'')),
          codeLang = $data['lang'] || 'HTML',
          lineNoStart = $data['lineStart'] || '1',
          rawCode = $el.html().replace(/<(\/)*_(\w+)/gi, '<$1$2'),
          rawCodeLines = rawCode.split('\n'),
          rawCodeWithLN=[],
          lineNumbers='',
          lineNoBlockClass='';

        //remove 1st and LastLine if blank
        if (!rawCodeLines[0].trim()) rawCodeLines.shift();
        if (!rawCodeLines[rawCodeLines.length-1].trim()) rawCodeLines.pop();
        rawCode = rawCodeLines.join('\n');

        //build line numbers
        var isStartNumber = !(new RegExp('[^0-9]','')).test(lineNoStart),
            showNo = (isStartNumber || (lineNoStart.indexOf('#')>=0)),
            curLineNo;
        lineNoStart = isStartNumber? (lineNoStart*1) : (lineNoStart.replace(/#/,''));
        rawCodeLines.forEach(function(line, idx){
          curLineNo = showNo? (isStartNumber? (idx+lineNoStart) : ((idx+1)+lineNoStart)) : lineNoStart;
          rawCodeWithLN.push(('<span class="hljs-tag line-number">'+curLineNo+'</span>'));
        });

        //trim Prefix Spaces
        if ($el.hasClass('trim')) {
          var lineLen = rawCodeLines[0].length,
              trimStr = '';
          for(var i=0;i<lineLen;i++){
            if (rawCodeLines[0][i] != ' ') {
              trimStr = rawCodeLines[0].substr(0, i);
              break;
            }
          }
          if (trimStr.length) {
            rawCodeLines.forEach(function(line,idx){
              rawCodeLines[idx] = line.replace((new RegExp('^'+trimStr,'')), '');
            });
            rawCode = rawCodeLines.join('\n');
          }
        }

        //highlight lines
        if ($data['lines']) {
          var hLine;
          lineNoStart = isStartNumber? lineNoStart : 1;
          (''+$data['lines']).split(',').forEach(function(lineN){
            if (lineN.indexOf('-')>0) {
              var lineRange = lineN.split('-'),
                hLineB = ((''+(lineRange[0] || 1)).trim() * 1) - lineNoStart,
                hLineE = ((''+(lineRange[1] || (rawCodeLines.length-1))).trim() * 1) - lineNoStart;
                rawCodeLines[hLineB] = '<hl>'+rawCodeLines[hLineB];
                rawCodeLines[hLineE] = rawCodeLines[hLineE]+'</hl>';

                rawCodeWithLN[hLineB] = '<span class="hljs-tag line-highlight">'+rawCodeWithLN[hLineB];
                rawCodeWithLN[hLineE] = rawCodeWithLN[hLineE]+'</span>';
            } else {
              hLine = (lineN.trim() * 1) - lineNoStart;
              rawCodeLines[hLine]  = '<hl>'+rawCodeLines[hLine]+'</hl>';
              rawCodeWithLN[hLine] = '<span class="hljs-tag line-highlight">'+rawCodeWithLN[hLine]+'</span>';
            }
          });
          rawCode = rawCodeLines.join('\n');
        };

        lineNumbers = rawCodeWithLN.join('\n');
        if (!$el.hasClass('line-numbers')) {
          lineNoBlockClass = 'hide';
        };

        var formattedCode = hljs.highlight(codeLang, rawCode).value
                          .replace(rxLHB, '<span class="hljs-tag line-highlight">')
                          .replace(rxLHE, '</span>')
                          .replace(rxLNB, '<span class="hljs-tag line-number">')
                          .replace(rxLNE, '</span>');

        var $copyToolbarBtn = $('<button class="btn copy-code" data-code-id="'+codeId+'">copy</button>').on('click', function(){
          var $thisCopyBtn = $(this),
              codeId = $thisCopyBtn.data('codeId'),
              selectedCode = window.getSelection().toString();
          var isCopied = (selectedCode)? _copyToClipboard() : _select2Copy('code_'+codeId, true);
          $thisCopyBtn.html(isCopied? 'Copied.' : 'Failed!');
          setTimeout(function(){ $thisCopyBtn.html('copy'); }, 500);
        });

        var $lineNoToolbarBtn = $('<button class="btn line-no '+($el.hasClass('no-num-tool')?'hide':'')+'">#</button>').on('click', function(){
          $(this).closest('code').find('.line-numbers-block').toggleClass('hide');
        });

        var $toolbarItemCopy   = $('<span class="toolbar-item" title="Copy to clipboard"></span>').append($copyToolbarBtn);
        var $toolbarItemLineNo = $('<span class="toolbar-item" title="Toggle line numbers"></span>').append($lineNoToolbarBtn);

        var $toolbar = $('<div class="toolbar hide"><span class="toolbar-item toolbar-title">'+($data['title']||'')+'</span></div>').append($toolbarItemLineNo).append($toolbarItemCopy);

        var $formattedCode = $('<code class="hljs"></code>')
                              .addClass(codeLang)
                              .addClass($el.attr('class'))
                              .append($toolbar)
                              .append('<table><tr><td class="line-numbers-block '+(isStartNumber?'':' no-border ')+lineNoBlockClass+'">'+lineNumbers+'</td>'+
                                      '<td id="code_'+codeId+'" class="code-block">'+formattedCode+'</td></tr></table>');

        var $preCodeBlock = $('<pre></pre>')
                            .append($formattedCode)
                            .on('mouseenter', function(e){
                              e.stopPropagation();
                              e.preventDefault();
                              $(this).find('code:not(.no-toolbar) .toolbar').removeClass('hide');
                            })
                            .on('mouseleave',function(e){
                              e.stopPropagation();
                              e.preventDefault();
                              $(this).find('code:not(.no-toolbar) .toolbar').addClass('hide');
                            });

        $el.attr('id',codeId).addClass('formatted').after($preCodeBlock);
    });
  }

}

function _select2Copy(containerid, copy2Clipboard) {
  var range;
  if (document.selection) {
    range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select();
  } else if (window.getSelection) {
    range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
  return (copy2Clipboard && _copyToClipboard());
}

function _copyToClipboard(text){
  if (text) {
    var id = "_copy2ClipboardHiddenTextArea_";
    var existsTextarea = document.getElementById(id);
    if (!existsTextarea){
      var textarea = document.createElement("textarea");
      textarea.id = id;
      // Place in top-left corner of screen regardless of scroll position.
      textarea.style.position = 'fixed';
      textarea.style.top = 0;
      textarea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textarea.style.width = '1px';
      textarea.style.height = '1px';

      // We don't need padding, reducing the size if it does flash render.
      textarea.style.padding = 0;

      // Clean up any borders.
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';

      // Avoid flash of white box if rendered for any reason.
      textarea.style.background = 'transparent';
      document.querySelector("body").appendChild(textarea);
      existsTextarea = document.getElementById(id);
    }

    existsTextarea.value = text;
    existsTextarea.select();
  }

  var copyStatus = false;
  try {
    copyStatus = document.execCommand('copy');
    window.getSelection().removeAllRanges();
  } catch (e) {}
  return copyStatus;
}