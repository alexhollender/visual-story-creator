// stores the sections of the curent page
let sections;
// stores which section is currently in view
let curSection;

// get section headings for a given article
function getSections(title) {
  $.getJSON(`https://${uiLang}.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${title}&redirects=1&prop=sections`,
    function(data) {
      console.log('getting sections...');
      sections = data.parse.sections;
    });
}

// create ToC container and call printToc
function createToc() {
  $('.mw-body section[data-mw-section-id="0"]').append(`
    <div id="toc-container" class="toc-wrapper toc-depth-4 expanded">
      <div class="toc-header header">
        <p class="contents-title">Contents</p>
        <p class="contents-show" onclick="toggleToc()">[show]</p>
        <p class="contents-hide" onclick="toggleToc()">[hide]</p>
      </div>
      <ul>
        <li class="toc-level-1">
          <a href='#Introduction'>
            <div class="toctext"><span class="tocnumb">0</span>Introduction</div>
          </a>
        </li>
      </ul>
      <div id="toc-anchor"></div>
    </div>
  `);
  printToc();
}

// print ToC to #toc-container
function printToc() {
  // check if getSections() has finished
  if (sections) {
    sections.forEach(function(element) {
      var selector = '.toc-wrapper > ul';
      for (i = 1; i < element.toclevel; i++) {
        selector = selector + '> li:last-child > ul';
      }
      $(selector).append(`
        <li class="toc-level-${element.toclevel}">
          <a href='#${element.anchor}' onclick='showSupToc()'>
            <span class="scroll-offset"></span>
            <div class="toctext">
              <span class="tocnumb">${element.number}</span>${element.line}
            </div>
          </a>
        <ul class="level-${element.toclevel + 1}"></ul>
        </li>
      `)
    });
  } else {
    // if sections aren't there yet retry the function up to 5 times
    tocErrorAttempts++;
    if (tocErrorAttempts < 5) {
      console.log(`toc did not load. Retry ${tocErrorAttempts}/5`);
      setTimeout(function(){
        printToc();
      }, 500);
    } else {
      window.alert('There was an error. Please reload the page');
    }
  }
}

// ========================================
// S C R O L L  S P Y  O N  S E C T I O N S
// ========================================
const config = {
  rootMargin: '-3% -0px -96% -0px',
  threshold: 0
};

let observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // if introduction section is intersecting
      if (entry.target.dataset.mwSectionId === "0") {
        $('div.article-title-subheader .title-section').html('');
      } else {
        // if any other section is intersecting
        curSection = entry.target.childNodes[0].id;
        curSectionClean = curSection.replace(/^\/+/g, '').replace(/_/g, ' ');
        curSectionDash = '| &nbsp&nbsp' + curSectionClean;
        $('div.article-title-subheader .title-section').html(curSectionDash);
      }
    }
  });
}, config);

// expand/collapse ToC
const toggleToc = () => {
  $('.toc-wrapper').toggleClass('expanded');
}

$(document).ready(function() {
  setTimeout(function(){
    createToc();
  }, 1000);

});
