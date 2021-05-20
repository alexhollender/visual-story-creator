// current text selection
var text;
// current image selection
var image;
var keyPointsPanel = document.getElementById('addKeyPointpanel');
var keyImagesPanel = document.getElementById('addKeyImagepanel');

// highlighting text > showing the key points panel
function mouseUp() {
    var textObj = window.getSelection();
    var textString = window.getSelection().toString().length;
    if (textString > 10) {
      // as document fragment
      text = textObj.getRangeAt(0).cloneContents();
      // as string
      // text = window.getSelection().toString();
        var rect = textObj.getRangeAt(0).getBoundingClientRect();
        var top = Math.floor(rect.top + rect.height + 10) + 'px';
        var left = Math.floor(rect.left) + 'px';
        keyPointsPanel.style.top = top;
        keyPointsPanel.style.left = left;
        $('img').css('border', 'none');
        $('#addKeyImagepanel').hide();
        $('#addKeyPointpanel').show();
    } else {
      // hide both panels
      $('#addKeyPointpanel').hide();
      $('#addKeyImagepanel').hide();
      // remove blue borders on any image that might have it
      $('img').css('border', 'none');
    }
}

// clicking on an image > showing the image panel
$('body').on('click', 'img', function(e){
  $('img').css('border', 'none');
  var target = e.target;
  image = target.cloneNode();
  $(target).css('border', '4px solid blue');
  var imgLocation = target.getBoundingClientRect();
  var top = Math.floor(imgLocation.top + imgLocation.height + 10) + 'px';
  var left = Math.floor(imgLocation.left) + 'px';
  keyImagesPanel.style.top = top;
  keyImagesPanel.style.left = left;
  $('#addKeyPointpanel').hide();
  $('#addKeyImagepanel').show();
});

// adding a key point
function addKeyPoint() {
  var target = $("#keyPoints option:selected").val();
  $(`#${target}`).html(text);
  $('#addKeyPointpanel').hide();
}

// adding a key image
function addKeyImage() {
  var destination = $("#keyImages option:selected").val();
  $(`#${destination}`).html(image);
  $('#addKeyImagepanel').hide();
  $('img').css('border', 'none');
}

// prevent links
$('body').on('click', 'a', function(e){
  e.stopPropagation();
  e.preventDefault();
});
