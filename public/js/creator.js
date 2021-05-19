// when the mouse comes up
// check if there is selected text
// if there is selected text
// - store it in a variable
// - get the position of the selected text
// - show the "add excerpt" widget
// - position the "add excerpt" widget next to the selected text

var text;
var panel = document.getElementById('addKeyPointpanel');

// showing the panel
function mouseUp() {
    var textObj = window.getSelection();
    var textString = window.getSelection().toString().length;
    // as document fragment
    text = textObj.getRangeAt(0).cloneContents();
    // as string
    // text = window.getSelection().toString();
    if (textString > 10) {
        var rect = textObj.getRangeAt(0).getBoundingClientRect();
        var top = Math.floor(rect.top + rect.height + 10) + 'px';
        var left = Math.floor(rect.left) + 'px';
        panel.style.top = top;
        panel.style.left = left;
        $('#addKeyPointpanel').show();
    } else {
      $('#addKeyPointpanel').hide();
    }
}

// adding a key point
function addKeyPoint() {
  var target = $("#keyPoints option:selected").val();
  $(`#${target}`).html(text);
  $('#addKeyPointpanel').hide();
}

// prevent links
$('a').click(function(e) {
    e.stopPropagation();
    e.preventDefault();
});
