/* global uiLang, currentPageTitle */

// current text selection
let fragment;
// current image selection
let image;
const keyPointsPanel = document.getElementById( 'addKeyPointpanel' );
const keyImagesPanel = document.getElementById( 'addKeyImagepanel' );
const keyPoints = [];
const keyImages = [];

function cleanupImages() {
	$( '#addKeyImagepanel' ).hide();
	$( 'img' ).css( 'border', 'none' );
}

function positionPanel( panelName, rectange ) {
	panelName.style.top = Math.floor( rectange.top + rectange.height + 10 ) + 'px';
	panelName.style.left = Math.floor( rectange.left ) + 'px';
	$( panelName ).show();
}

// highlighting text > showing the key points panel
// eslint-disable-next-line no-unused-vars
function mouseUp() {
	const textObj = window.getSelection();
	const strLength = window.getSelection().toString().length;
	if ( strLength > 10 ) {
		// as document fragment
		fragment = textObj.getRangeAt( 0 ).cloneContents();
		const rect = textObj.getRangeAt( 0 ).getBoundingClientRect();
		positionPanel( keyPointsPanel, rect );
		cleanupImages();
	} else {
		// hide both panels
		$( '#addKeyPointpanel' ).hide();
		cleanupImages();
	}
}

// clicking on an image > showing the image panel
$( 'body' ).on( 'click', 'img', function ( e ) {
	$( 'img' ).css( 'border', 'none' );
	const target = e.target;
	image = target.cloneNode();
	$( target ).css( 'border', '4px solid blue' );
	const imgLocation = target.getBoundingClientRect();
	positionPanel( keyImagesPanel, imgLocation );
	$( '#addKeyPointpanel' ).hide();
} );

// adding a key point
// eslint-disable-next-line no-unused-vars
function addKeyPoint() {
	// eslint-disable-next-line no-jquery/no-sizzle
	const target = $( '#keyPoints option:selected' ).val();
	$( `#keypoint${target}` )
		.html( '' )
		.append( $( '<p>' ).append( fragment ) );
	$( '#addKeyPointpanel' ).hide();
	keyPoints[ target ] = $( `#keypoint${target}` ).html();
}

// adding a key image
// eslint-disable-next-line no-unused-vars
function addKeyImage() {
	// eslint-disable-next-line no-jquery/no-sizzle
	const destination = $( '#keyImages option:selected' ).val();
	$( `#img${destination}` ).html( image );
	$( '#addKeyImagepanel' ).hide();
	$( 'img' ).css( 'border', 'none' );
	keyImages[ destination ] = image.cloneNode();
}

function saveWikitext( wikitext ) {
	const $form = $( '<form>' ).attr( { method: 'post', enctype: 'multipart/form-data' } ).addClass( 'oo-ui-element-hidden' );
	const params = {
		format: 'text/x-wiki',
		model: 'wikitext',
		// oldid: this.requestedRevId,
		// wpStarttime: this.startTimeStamp,
		// wpEdittime: this.baseTimeStamp,
		wpTextbox1: wikitext,
		// wpEditToken: mw.user.tokens.get( 'csrfToken' ),
		wpUnicodeCheck: 'ℳ𝒲♥𝓊𝓃𝒾𝒸ℴ𝒹ℯ',
		wpUltimateParam: true
	};
	// Add params as hidden fields
	for ( const key in params ) {
		$form.append( $( '<input>' ).attr( { type: 'hidden', name: key, value: params[ key ] } ) );
	}
	// Submit the form, mimicking a traditional edit
	// Firefox requires the form to be attached
	$form.attr( 'action', `https://${uiLang}.wikipedia.org/w/index.php?title=User:AHollender_(WMF)/story/${currentPageTitle}&action=submit` ).appendTo( 'body' ).trigger( 'submit' );
}

// eslint-disable-next-line no-unused-vars
function convertToWikitext() {
	let html = '';
	for ( let i = 0, l = Math.max( keyPoints.length, keyImages.length ); i < l; i++ ) {
		if ( keyImages[ i ] ) {
			const $p = $( '<div>' )
				.addClass( 'keyImage' )
				.append(
					$( '<a>' )
						.attr( 'href', image.getAttribute( 'resource' ) )
						.append(
							$( image ).attr( { width: 480, height: null } )
						)
				);
			html += '\n' + $p[ 0 ].outerHTML;
		}
		if ( keyPoints[ i ] ) {
			html += '\n' + $( '<div>' ).addClass( 'keyPoint' ).html( keyPoints[ i ] )[ 0 ].outerHTML;
		}
	}
	$.post( `https://${uiLang}.wikipedia.org/api/rest_v1/transform/html/to/wikitext`, {
		html: html,
		// eslint-disable-next-line camelcase
		scrub_wikitext: 1
	} ).then( function ( resp ) {
		// Trim, and remove excess linbreaks
		const wikitext = resp.trim().replace( /\n{3,}/g, '\n\n' );
		saveWikitext( wikitext );
	} );
}

// prevent links
$( 'body' ).on( 'click', 'a', function ( e ) {
	e.stopPropagation();
	e.preventDefault();
} );
