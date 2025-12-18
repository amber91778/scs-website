
(function( $ ) {
	
	"use strict";

	$( '.slick-slider' ).each(function() {
		$( this ).on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
			
			if(!slick.$dots){
				return;
			}
  
			var count = slick.$dots[0].children.length;
			$( this ).find('ul.slick-dots' ).attr('data-slides', count);
			
		});		
	});

})( jQuery );