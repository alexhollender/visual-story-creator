// current text selection
var text;
// current image selection
var image;
var keyPointsPanel = document.getElementById('addKeyPointpanel');
var keyImagesPanel = document.getElementById('addKeyImagepanel');

function cleanupImages() {
  $('#addKeyImagepanel').hide();
  $('img').css('border', 'none');
}

function positionPanel(panelName, rectange) {
  panelName.style.top = Math.floor(rectange.top + rectange.height + 10) + 'px';
  panelName.style.left = Math.floor(rectange.left) + 'px';
  $(panelName).show();
}

// highlighting text > showing the key points panel
function mouseUp() {
  var textObj = window.getSelection();
  var strLength = window.getSelection().toString().length;
  if (strLength > 10) {
    // as document fragment
    text = textObj.getRangeAt(0).cloneContents();
    // as string
    // text = window.getSelection().toString();
      var rect = textObj.getRangeAt(0).getBoundingClientRect();
      positionPanel(keyPointsPanel, rect);
      cleanupImages();
  } else {
    // hide both panels
    $('#addKeyPointpanel').hide();
    cleanupImages();
  }
}

// clicking on an image > showing the image panel
$('body').on('click', 'img', function(e){
  $('img').css('border', 'none');
  var target = e.target;
  image = target.cloneNode();
  $(target).css('border', '4px solid blue');
  var imgLocation = target.getBoundingClientRect();
  positionPanel(keyImagesPanel, imgLocation);
  $('#addKeyPointpanel').hide();
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
