// stores current search term
let searchTerm;
// stores page title, description, and images
let searchResultsDetailsSorted = [];
// stores which search component is currently active
var $searchComponent;

// ፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨ //
// getting, sorting, and printing search results //
// ፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨ //

// check if there is a search term, run openSearch
function checkValThenSearch(searchTerm) {
  if (searchTerm.length > 0) {
    openSearch(searchTerm);
    $searchComponent.addClass('active');
  } else {
    $('ul.searchResults').hide();
    selectedItemIndex = 0;
    $('.search-button').removeClass('active');
    $('.search-container').removeClass('active');
  }
}

// Wikipedia API > Query (returns 10 results on a search term)
function openSearch(string) {
  console.log("openSearch is running");
  $.getJSON(`https://${uiLang}.wikipedia.org/w/api.php?format=json&origin=*&formatversion=2&action=query&prop=pageimages%7Cdescription&uselang=content&smaxage=300&maxage=300&generator=prefixsearch&pilicense=any&piprop=thumbnail&pithumbsize=160&gpssearch=${string}`, function(data) {
    var responseObject = Object.entries(data);
    sortResults(responseObject);
  });
};

// sorts results from search API call
function sortResults(object) {
  var searchResults = object[2][1].pages;
  var searchResultsDetails = [];
  searchResults.forEach(function(element) {
    var item = {
      title: element.title,
      description: element.description ? element.description : '',
      image: element.thumbnail ? element.thumbnail.source : '/img/placeholder-img.svg',
      index: element.index
    }
    searchResultsDetails.push(item);
  });
  searchResultsDetailsSorted = searchResultsDetails.sort(compareValues('index', 'asc'));
  printResults();
};

// prints results from searchResults into the <ul>
function printResults(){
  var $searchResultsMenu = $searchComponent.children('ul');
  $searchResultsMenu.show();
  $searchResultsMenu.html('');
	searchResultsDetailsSorted.forEach(function(element) {
  	$searchResultsMenu.append(`
      <li>
        <a tabindex="0">
          <div class="thumbnail" style="background-image:url('${element.image}')"></div>
          <div class="titleDesc">
            <p class="title">${element.title}</p>
            <p class="description">${element.description}</p>
          </div>
        </a>
      </li>`)
	});
  $searchResultsMenu.append(`<li><a tabindex="-1" class="containing"><img src="/img/articleSearch.svg"> Search for pages containing "<strong>${searchTerm}</strong>"</a></li>`);
}

// Sort an array of objects (search results) by a given key
function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

// ፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨ //
// search UX interactivity //
// ፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨፨ //

// check value of input field when focused
const checkVal = () => {
  var x = $('input').val().length;
  if (x > 0) {
    $('ul.searchResults').show();
  }
}

// keyboard support for search results list
var searchInput = document.querySelectorAll('.search-input');
// start item index at 1
var selectedItemIndex = 0;
// when a key is pressed
searchInput.forEach(item => {
  item.addEventListener('keydown', function(e) {
    var key = e.keyCode;
    // if the down key is pressed
    if (key === 40) {
      // check if the item index is less than 12 (so it stops at end of list)
      if (selectedItemIndex < 11) {
        selectedItemIndex++;
        // add selected class to element
        $(`ul.searchResults li:nth-child(${selectedItemIndex})`).addClass('selected');
        // remove selected class from previous element
        $(`ul.searchResults li:nth-child(${selectedItemIndex - 1 })`).removeClass('selected');
        // get name of selected item
        var string = $(`ul.searchResults li:nth-child(${selectedItemIndex}) a div.titleDesc p.title`).html();
        // update input field
        $('input.search-input').val(string);
      }
    } else if (key === 38) {
      if (selectedItemIndex > 0) {
        e.preventDefault();
        $(`ul.searchResults li:nth-child(${selectedItemIndex})`).removeClass('selected');
        $(`ul.searchResults li:nth-child(${selectedItemIndex - 1 })`).addClass('selected');
        selectedItemIndex--;
        var string = $(`ul.searchResults li:nth-child(${selectedItemIndex}) a div.titleDesc p.title`).html();
        if (selectedItemIndex > 0) {
          $('input.search-input').val(string);
        }
      }
    } else if (key === 13) {
      var pageName = $('input.search-input').val().replace(/ /g,'_');
  		location = `/${pageName}`;
    }
  });
});

// if you hover over the list remove the selected class from li
$('ul.searchResults').hover(function() {
    $('li').removeClass('selected');
});

// clicking on the search button
const searchButtonClick = () => {
  var pageName = $('input.search-input').val().replace(/ /g,'_');
  location = `/${pageName}`;
}

// expand search in floating header
const showStickySearch = () => {
  $('a.search-icon.subheader').hide();
  $('#search-floating').css('display', 'flex');
  $('header').addClass('headroom--pinned');
  $('header .article-title-subheader').hide();
  document.getElementById('floating-search-input').focus();
};

// close search
const closeSearch = () => {
  $('ul.searchResults').hide();
  selectedItemIndex = 0;
  $('.search-container').removeClass('active');
  $('a.search-icon.subheader').show();
  $('#search-floating').hide();
  $('header .article-title-subheader').show();
};

$(document).ready(function() {

  // when input changes search Wikipedia (top search box)
  $('#search-top input').on('input', () => {
    // set the search term
    searchTerm = $('#search-top input').val();
    // set which search component is active
    $searchComponent = $('#search-top');
    checkValThenSearch(searchTerm);
	});

  // when input changes search Wikipedia (floating search box)
  $('#search-floating input').on('input', () => {
    // set the search term
    searchTerm = $('#search-floating input').val();
    // set which search component is active
    $searchComponent = $('#search-floating');
    checkValThenSearch(searchTerm);
	});

  // when clicking on a search result
	$(document).on('click', '#search-floating ul.searchResults li', function() {
    console.log('yazi');
    $('input').val('');
    $('ul.searchResults').html('');
    $('ul.searchResults').hide();
    var pageName = $(this).find('.title').html().replace(/ /g,'_');
		location = `/${pageName}`;
  });

  // when clicking outside the search results list
  $(document).on('click', 'body', () => {
    $('ul.searchResults').hide();
    selectedItemIndex = 0;
    $('.search-container').removeClass('active');
    $('a.search-icon.subheader').show();
    $('#search-floating').hide();
    $('header .article-title-subheader').show();
  });

  // when clicking the input prevent that click from triggering the above function that
  // closes the search menu
  $('input, a.search-icon').on('click', function (event) {
    event.stopPropagation();
  });

});
