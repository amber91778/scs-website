(function ($) {
	"use strict";

	$(document).ready(function(e){
		// Woocommerce Cart
		$('.add_to_cart_button').on('click', function(){
			var product_name = $(this).parents('li.product').find('h3').text();

			$('.vu_wc-cart-notification').stop(true, true).fadeOut(400, function(){
				$(this).find('.vu_wc-item-name').text( product_name );
			});
		});

		$('.vu_wc-cart-notification').hover(function(){
			$(this).stop(true, true).fadeOut(400);
		})

		$('.vu_wc-menu-item').hover(function(){
			$(this).find('.vu_wc-cart').stop(true, true).fadeIn(400);
		}, function(){
			$(this).find('.vu_wc-cart').stop(true, true).fadeOut(400);
		});

		$(document).ajaxSuccess(function(e, xhr, settings, data) {
			if( settings.url !== undefined && settings.url.indexOf("wc-ajax=add_to_cart") != -1 ) {
				var $quantity = $(data.fragments["div.widget_shopping_cart_content"]).find('.quantity'),
					count = 0,
					t;
				
				$quantity.each(function(index, value){
					var re = /(^\d+)/,
						m;
					 
					if ((m = re.exec( $(this).text() )) !== null) {
					    count += parseInt(m[0]);
					}
				});

				$('.vu_wc-menu-item .vu_wc-count').text(count);

				$('.vu_wc-menu-item .vu_wc-cart-notification').stop(true, true).fadeIn(400);

				t = setTimeout(function(){
					$('.vu_wc-menu-item .vu_wc-cart-notification').stop(true, true).fadeOut(400);
					clearTimeout(t);
				}, 3000);
			}
		});

		// WooCommerce: Input Checkbox
		$('.woocommerce input[type="checkbox"]').each(function(){
			var $this = $(this),
				$vu_checkbox = $('<span></span>').addClass('vu_input-checkbox').html('<i class="fa fa-check"></i>');

			if( $this.is(':checked') ) {
				$vu_checkbox.addClass('checked');
			}

			$this.hide();

			$vu_checkbox.insertBefore($this);
		});

		$(document.body).on('click', '.vu_input-checkbox', function() {
			var $this = $(this);

			if( $this.hasClass('checked') ) {
				$this.next('input[type="checkbox"]').prop('checked', false).trigger('change');
			} else {
				$this.next('input[type="checkbox"]').prop('checked', true).trigger('change');
			}
		});

		$(document.body).on('change', '.woocommerce input[type="checkbox"]', function() {
			var $this = $(this);

			if( $this.is(':checked') ) {
				$this.prev('.vu_input-checkbox').addClass('checked');
			} else {
				$this.prev('.vu_input-checkbox').removeClass('checked');
			}
		});

		// WooCommerce: Variable
		$('.woocommerce .variations_form .variations select').addClass('form-control');

		// WooCommerce: Pagination
		$('.woocommerce-pagination ul.page-numbers').addClass('vu_p-list list-unstyled').removeClass('page-numbers');
		$('.woocommerce-pagination').addClass('vu_pagination').removeClass('woocommerce-pagination');

		// WooCommerce: Quantity
		var vu_wc_quantity = function() {
			var $vu_wc_quantity = $('.woocommerce .quantity .qty');

			$vu_wc_quantity.each(function(index, value){
				var $this = $(this),
					$button = $('<input/>').attr({'type': 'button'}).addClass('vu_qty-button');
				
				$button.clone().attr({'value': '-'}).addClass('minus').insertBefore($this);
				$button.attr({'value': '+'}).addClass('plus').insertAfter($this);
			});
		}

		vu_wc_quantity();

		$(document.body).on('click', '.vu_qty-button', function(){
			var $this = $(this),
				$qty = $this.parent('.quantity').find('.qty'),
				value = $qty.val();

			if( $this.hasClass('minus') ) {
				if( value > 0 )
					$qty.val( parseInt(value) - parseInt($qty.attr('step')) ).trigger('change');
			} else if( $this.hasClass('plus') ) {
				$qty.val( parseInt(value) + parseInt($qty.attr('step')) ).trigger('change');
			}
		});

		// WC Update Cart Button
		$(document).ajaxSuccess(function(e, xhr, settings, data) {
			if( settings.url !== undefined && settings.url.indexOf("wc-ajax=get_refreshed_fragments") != -1 ) {
				vu_wc_quantity();
			}
		});

		// WC Classes
		$('.woocommerce .related.products > h2').addClass('vu_wc-title');
		$('.woocommerce-billing-fields > h3').addClass('vu_wc-title');
		$('.woocommerce-shipping-fields > h3').addClass('vu_wc-title');
		$('.woocommerce #order_review_heading').addClass('vu_wc-title');
		$('.woocommerce .cart_totals > h2').addClass('vu_wc-title');

		// My Account Pages
		$('.woocommerce-account .woocommerce').addClass('row');
		$('.woocommerce-account .woocommerce-MyAccount-navigation').addClass('col-md-3 m-b-50');
		$('.woocommerce-account .woocommerce-MyAccount-content').addClass('col-md-9');

		// Menu
		$('.woocommerce-MyAccount-navigation').addClass('widget_nav_menu');
		$('.woocommerce-MyAccount-navigation > ul').addClass('menu');
		$('.woocommerce-MyAccount-navigation li.is-active').addClass('current-menu-item');

		// Others Pages
		$('.woocommerce-Address-title.title').addClass('m-t-45');
		$('.woocommerce-account .woocommerce h2').addClass('vu_wc-title');
		$('.woocommerce-account .woocommerce h3').addClass('vu_wc-title');
		$('.woocommerce .edit-account legend').addClass('vu_wc-title');

		$('.woocommerce-account .woocommerce input[type="text"]').addClass('form-control');
		$('.woocommerce-account .woocommerce input[type="email"]').addClass('form-control');
		$('.woocommerce-account .woocommerce input[type="password"]').addClass('form-control');
		$('.woocommerce-account .woocommerce select').addClass('form-control');
		$('.woocommerce-account .woocommerce textarea').addClass('form-control');

		$('.input-text').addClass('form-control');

		$('.woocommerce-account .woocommerce-MyAccount-navigation').removeClass('woocommerce-MyAccount-navigation');
		$('.woocommerce-account .woocommerce-MyAccount-content').removeClass('woocommerce-MyAccount-content');


		// Shipping Calculator
		$('.woocommerce .shipping-calculator-form input[type="text"]').addClass('form-control');
		$('.woocommerce .shipping-calculator-form select').addClass('form-control');
		$('.woocommerce .shipping-calculator-form textarea').addClass('form-control');

		// Comment Form
		$('.woocommerce #review_form #commentform input[type="text"]').addClass('form-control');
		$('.woocommerce #review_form #commentform select').addClass('form-control');
		$('.woocommerce #review_form #commentform textarea').addClass('form-control');
		$('.woocommerce #review_form #commentform #submit').addClass('button alt').attr({'id': ''});

		// WC Sorting
		var $vu_dropdown = $('select.orderby');
		
		$vu_dropdown.each(function(){
			$(this).vu_DropDown();
		});
	});

	$(window).on('load', function(){
		setTimeout(function(){
			// WooCommerce: billing_state
			$('select#billing_state').addClass('form-control m-t-0');
		}, 100);
	});

	// WC Sorting Custom Dropdown
	$.fn.vu_DropDown = function(options) {
		var $this = this,
			$dropdown = $('<div></div>').addClass('vu_dropdown'),
			$options = $('<ul></ul>').addClass('vu_dd-options'),
			$placeholder = $('<span></span>').text( $this.find('option:selected').text() );

		$placeholder.appendTo($dropdown);
		$options.appendTo($dropdown);

		$this.find('option').each(function(index, value){
			$('<li></li>').attr({'data-value': $(this).attr('value')}).text( $(this).text() ).appendTo($options);
		});

		$options.find('li[data-value="'+ $this.val() +'"]').addClass('active');

		$dropdown.on('click', function(e){
			$(this).toggleClass('active');
			return false;
		});

		$options.find('li').on('click', function(){
			$this.val( $(this).data('value') ).trigger('change');
			$placeholder.text( $(this).text() );

			//active class
			$options.find('li').removeClass();
			$(this).addClass('active');
		});

		$this.hide();

		$dropdown.insertAfter($this);

		$(document).on("click", function() {
			$('.vu_dropdown').removeClass('active');
		});
	}
})(jQuery);