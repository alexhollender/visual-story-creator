// current text selection
var fragment;
// current image selection
var image;
var keyPointsPanel = document.getElementById('addKeyPointpanel');
var keyImagesPanel = document.getElementById('addKeyImagepanel');
var keyPoints = [];
var keyImages = [];

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
    fragment = textObj.getRangeAt(0).cloneContents();
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
  $(`#keypoint${target}`)
    .html('')
    .append($('<p>').append(fragment));
  $('#addKeyPointpanel').hide();
  keyPoints[target] = $(`#keypoint${target}`).html();
}

// adding a key image
function addKeyImage() {
  var destination = $("#keyImages option:selected").val();
  $(`#img${destination}`).html(image);
  $('#addKeyImagepanel').hide();
  $('img').css('border', 'none');
  keyImages[destination] = image.cloneNode();
}

function convertToWikitext() {
  var html = '';
  for (var i = 0, l = Math.max(keyPoints.length, keyImages.length); i < l; i++) {
    if (keyImages[i]) {
      var $p = $('<div>')
        .addClass('keyImage')
        .append(
          $('<a>')
            .attr('href', image.getAttribute('resource'))
            .append(
              $(image).attr({width: 480, height: null})
            )
        );
      html += '\n' + $p[0].outerHTML;
    }
    if (keyPoints[i]) {
      html += '\n' + $('<div>').addClass('keyPoint').html(keyPoints[i])[0].outerHTML;
    }
  }
  $.post(`https://${uiLang}.wikipedia.org/api/rest_v1/transform/html/to/wikitext`, {
    html: html,
    scrub_wikitext: 1
  }).then(function(resp) {
    // Trim, and remove excess linbreaks
    var wikitext = resp.trim().replace(/\n{3,}/g, '\n\n');
    console.log(wikitext);
  });
}

// prevent links
$('body').on('click', 'a', function(e){
  e.stopPropagation();
  e.preventDefault();
});
