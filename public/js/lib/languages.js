let uiLang = 'en';

// strings for UI language
var strings = {
  es: {
    articleString: 'Artículo',
    betaString: 'Beta',
    contentsString: 'Índice',
    contributionsString: 'Contribuciones',
    discussionString: 'Discusión',
    editString: 'Editar',
    editSourceString: 'Editar código',
    gadgetString: 'Accesorios',
    hideString: '[ocultar]',
    historyString: 'Ver historial',
    introductionString: 'Introducción',
    languagebuttonString: '95 Idiomas',
    languageMenuString: '<img src="/img/uls-es.png" />',
    logoString: '<img src="/img/logo-es.svg" />',
    logoutString: 'Salir',
    preferencesString: 'Preferencias',
    readString: 'Leer',
    sandboxString: 'Taller',
    searchString: 'Buscar',
    searchPlaceholderString: 'Buscar en Wikipedia',
    signUpString: 'Crear una cuenta / Acceder',
    showString: '[mostrar]',
    taglineString: '',
    watchlistString: 'Lista de seguimiento'
  },
  id: {
    articleString: 'Halaman',
    betaString: 'Beta',
    contentsString: 'Daftar isi',
    contributionsString: 'Kontribusi',
    discussionString: 'Pembicaraan',
    editString: 'Sunting',
    editSourceString: 'Sunting sumber',
    gadgetString: 'Accesorios',
    hideString: '[sembunyikan]',
    historyString: 'Versi terdahulu',
    introductionString: 'Pengantar',
    languagebuttonString: '95 Bahasa',
    languageMenuString: '<img src="/img/uls-id.png" />',
    logoString: '<img src="/img/logo-id.svg" />',
    logoutString: 'Keluar log',
    preferencesString: 'Preferensi',
    readString: 'Halaman',
    sandboxString: 'Sandbox',
    searchString: 'Cari',
    searchPlaceholderString: 'Cari Wikipedia',
    signUpString: 'Buat akun baru / Masuk log',
    showString: '[tampilkan]',
    taglineString: 'Dari Wikipedia bahasa Indonesia, ensiklopedia bebas',
    watchlistString: 'Daftar pantauan'
  }
}

// get language code from URL, store in session storage, call setUiLanguage
function getLanguageFromURL() {
  const string = window.location.href;
  // if there is a language code
  if (string.split('?')[1]) {
    const langCode = string.split('?')[1];
    // store language code in session storage
    sessionStorage.setItem('language', langCode);
  }
  setUiLanguage();
}

function setUiLanguage() {
  // if there is a language code in session storage
  if (sessionStorage.getItem('language')) {
    uiLang = sessionStorage.getItem('language');
    updateUiStrings()
  }
}

function updateUiStrings() {
  for (const [key, value] of Object.entries(strings[uiLang])) {
    $(`[data-stringName="${key}"]`).html(value);
  }
  // replace placeholder text in search input
  var input = document.querySelectorAll('.search-container input');
  input.forEach(function(item) {
    item.placeholder = strings[uiLang].searchPlaceholderString;
  });
}
