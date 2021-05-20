// toggle open close user menu
const toggleUserMenu = () => {
  $('.site-header ul.user-menu').toggle();
};

const toggleUserMenuFloating = () => {
  $('.floating-header ul.user-menu').toggle();
};

// when clicking outside menu
$(document).on('click', 'body', () => {
  $('ul.user-menu').hide();
});

$('#loggedOutUserMenuButton, #loggedInUserMenuButton, .user-icon').on('click', function (event) {
  event.stopPropagation();
});
