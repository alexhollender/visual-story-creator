// stores the sections of the curent page
let sections;
// stores the number of attempts printToc()
// has made
let tocErrorAttempts = 0;

// get section headings for a given article
function getSections(title) {
  $.getJSON(`https://${uiLang}.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${title}&redirects=1&prop=sections`,
    function(data) {
      console.log('getting sections...');
      sections = data.parse.sections;
      printToc();
    });
}

// ========================================
// P R I N T  T O C
// ========================================

// print the ToC to the container
function printToc() {
  if (sections) {
    sections.forEach(function(element) {
      var selector = '.toc-wrapper > ul';
      // generate the appropriate selector based on toclevel
      for (i = 1; i < element.toclevel; i++) {
        selector = selector + '> li:last-child > ul';
      }
      if (element.toclevel === 1) {
        $(selector).append(`
          <li class="toc-level-${element.toclevel}" onclick="showChildren(this)">
            <span onclick="arrowToggle(this)"></span>
            <a href='#${element.anchor}'>
              <div class="toctext">
                <span class="tocnumb">${element.number}</span>${element.line}
              </div>
            </a>
            <ul class="level-2"></ul>
          </li>
        `);
      } else {
        $('.toc-wrapper > ul > li:last-child').addClass('parent');
        $(selector).append(`
          <li class="toc-level-${element.toclevel}">
          <a href='#${element.anchor}'>
          <div class="toctext">
          <span class="tocnumb">${element.number}</span>${element.line}
          </div>
          </a>
          <ul class="level-${element.toclevel + 1}"></ul>
          </li>
        `)
      }
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
var $firstTocItem = $('ul#table-of-contents li:first-child');

function clearActive() {
  $('ul#table-of-contents li').removeClass('active');
}

const config = {
  rootMargin: '-30% -0px -69% -0px',
  threshold: 0
};

let observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // if introduction section is intersecting
      if (entry.target.dataset.mwSectionId === "0") {
        clearActive();
        $firstTocItem.addClass('active');
      } else {
        // if any other section is intersecting
        var curSection = entry.target.childNodes[0].id;
        clearActive();
        $(`ul#table-of-contents li a[href="#${curSection}"]`).parent('li').addClass('active');
      }
    } else if (!entry.isIntersecting && window.pageYOffset < 100) {
      // if no sections are intersecting and near top
      console.log(`no sections are intersecting and you are near the top`);
      clearActive();
      $firstTocItem.addClass('active');
    }
  });
}, config);


// ==============================
// T o C  I N T E R A C T I O N S
// ==============================

// expand/collapse ToC
const toggleToc = () => {
  $('.toc-wrapper').toggleClass('expanded');
}

// expand collapsed sections
const showChildren = (element) => {
  $('li.toc-level-1').removeClass('show-children');
  $(element).toggleClass('show-children');
}

const arrowToggle = (element) => {
  event.stopPropagation();
  $(element).closest('li').toggleClass('show-children');
}

// ========================================
// S C R O L L  S P Y  O N  S I D E B A R
// ========================================

// if the sidebar is open, close it (and show the ToC)
// once the person has scrolled past it
const sidebar = document.getElementById('sidebar');

let sidebarObserver = new IntersectionObserver(function(entry) {
  if(entry[0].isIntersecting === false) {
    hideSidebar();
  }
});

sidebarObserver.observe(sidebar);

const hideSidebar = () => {
  $('div.sidebar-wrapper, .page-container, .history-page').removeClass('show-sidebar');
  $('a.hamburger').removeClass('close');
};
