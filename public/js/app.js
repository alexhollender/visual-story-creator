// stores the title of the current page
let currentPageTitle;
// object of headings
let headingsObject = [];

// get page title from URL and calls getPage
function getPageTitleFromUrl() {
  currentPageTitle = window.location.pathname.replace(/^\/+/g, '').replace(/_/g, ' ');
  getPage(currentPageTitle);
  getSections(currentPageTitle);
};

// gets page HTML from restbase API
function getPage(title) {
  $.get( `https://${uiLang}.wikipedia.org/api/rest_v1/page/html/${title}`, function(data) {
    console.log('getting page...');
    $('div.content').html(data);
    // add the page heading
    $('div.article-header h1').html(currentPageTitle);
    // add the page title to the floating header
    $('div.article-title-subheader .title').html(currentPageTitle);
    // make language switcher button (main)
    const langSwitcher = `<a class="button button-menu" onclick="toggleLanguageMenu()"> <img src="/img/languages.svg" /><span data-stringName="languagebuttonString">${(strings[uiLang] ? strings[uiLang].languagebuttonString : '95 Languages')}</span><img src="/img/down.svg" /></a>`;
    // make language switcher button (floating)
    const langSwitcherFloating = `<a class="button button-menu" onclick="toggleLanguageMenuFloating()"> <img src="/img/languages.svg" /><span data-stringName="languagebuttonString">${(strings[uiLang] ? strings[uiLang].languagebuttonString : '95 Languages')}</span><img src="/img/down.svg" /></a>`;
    // add the language switcher
    $('header .languages-container').prepend(langSwitcherFloating);
    $('main .languages-container').prepend(langSwitcher);
    // reset the <base> URL
    $('base').attr('href','');
    // observe which section is currently in view
    document.querySelectorAll('.mw-body > section').forEach((section) => {
     observer.observe(section);
   });
  });
};

// open/close sidebar
const toggleSidebar = () => {
  $('div.sidebar-wrapper, main, .history-page').toggleClass('show-sidebar');
  $('a.hamburger').toggleClass('close');
};

// open/close main language menu
const toggleLanguageMenu = () => {
  $('main .language-menu').toggle();
}

// open/close floating header language menu
const toggleLanguageMenuFloating = () => {
  $('header .language-menu').toggle();
}

// close language menu when clicking outside menu
$(document).on('click', 'body', () => {
  $('.language-menu').hide();
});

// prevent clicking on language button from closing language menu
$('body').on('click', '.languages-container a', function(e){
  e.stopPropagation();
});

// hide/show options panel
const toggleSettingsPanel = () => {
  $('.animation-checkbox').toggleClass('open');
}

// switch logged-in logged-out state
const switchLoginState = () => {
  $('body').toggleClass('loggedIn');
}

// turn on floating header from hover
$('header').hover(function(){
    $(this).addClass('headroom--pinned');
});

$(document).ready(function() {

  getLanguageFromURL();
  getPageTitleFromUrl();

  // headroom init
	$("header").headroom({
		offset: 100,
	});

  $(window).blur(function() {
    $('header').addClass('headroom--pinned');
    $('header').removeClass('headroom--unpinned');
  });

});
