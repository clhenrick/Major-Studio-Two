// scroll interaction script
$(document).ready(function () {


	var s,
		scrolled = false,
		$body = $(document.body),
		$bodyHeight = $body.height(),
		$window = $(window),
		$winHeight = $window.height(),
		init = false;

		console.log('winHeight: ', $winHeight);

		$(window).scroll(function(){
			s = $(window).scrollTop();
			console.log('scroll value is: ', s);

			if (s >= 960){
				// $('#map').css({'z-index': '5'});
				// $('#map-placeholder').css({'background-color' : 'hsla(0,100%,100%,0)'});
			} 
			if (s <= 960){
				// $('#map-placeholder').css({'background-color' : 'hsla(0,100%,100%,1)'});
				// $('#map').css({'z-index': '-3'});
			} 

			// if (s >= 3670) $('#forester-pass').get(0).play();

			// if (s >= 4270 || s <= 3670) $('#forester-pass').get(0).pause();
		});



});