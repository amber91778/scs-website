BAPSObject.prototype.analyticsInit = function ($) {
    BAPS.Analytics = {};

    $(document).ready(function () {
        BAPS.Analytics.AttachAnalytics();
    });

    BAPS.Analytics.AttachAnalytics = function () {
        BAPS.console.log('AttachAnalytics');

        if (window.dataLayer) {
            $('body').on('click', '[data-gtm-add-basket]', BAPS.Analytics.AddToCart);
            $('body').on('click', '[data-gtm-remove-basket]', BAPS.Analytics.RemoveFromCart);
        }
        else {
            BAPS.console.log('dataLayer not found.');
        }
    };

    BAPS.Analytics.Push = function (object) {
        BAPS.console.log('BAPS.Analytics.Push');

        if (window.dataLayer) {
            dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
            dataLayer.push(object);
        }
    };

    BAPS.Analytics.AddToCart = function () {
        BAPS.console.log('BAPS.Analytics.AddToCart');
        var productObject = JSON.parse(decodeURIComponent($(this).data('gtm-add-basket')));

        BAPS.console.log(productObject);

        BAPS.Analytics.Push(productObject);
    };

    BAPS.Analytics.RemoveFromCart = function () {
        BAPS.console.log('BAPS.Analytics.RemoveFromCart');
        var productsObject = JSON.parse(decodeURIComponent($(this).data('gtm-remove-basket')));

        BAPS.console.log(productsObject);

        BAPS.Analytics.Push(productsObject);
    };

    BAPS.Analytics.ViewCart = function () {
        BAPS.console.log('BAPS.Analytics.ViewCart');
        var cartObject = JSON.parse(decodeURIComponent($('.cart-preview__list').data('gtm-view-cart')));

        BAPS.console.log(cartObject);

        BAPS.Analytics.Push(cartObject);
    };

    BAPS.Analytics.AddPaymentInfo = function (input, option) {
        BAPS.console.log('BAPS.Analytics.AddPaymentInfo');
        var optionObject = JSON.parse(decodeURIComponent(input.data('gtm-add-payment-info')));

        optionObject.ecommerce.payment_type = option;

        BAPS.console.log(optionObject);

        BAPS.Analytics.Push(optionObject);
    };
};
