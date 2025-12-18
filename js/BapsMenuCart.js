BAPSObject.prototype.MenuCartInit = function ($) {

    BAPS.MenuCart = {};

    $(document).ready(function () {
        BAPS.MenuCart.AttachMenuCart();
    });

    BAPS.MenuCart.AttachMenuCart = function () {
        $('.util-nav__item--cart a.util-nav__link').off('click');

        if (!BAPS.elementExists('.cart-overview-wrap')) {
            $("body").on("click", '.util-nav__item--cart a.util-nav__link', BAPS.MenuCart.CartNavItemClick);
            $("body").on("click", ".util-nav__item--cart", BAPS.MenuCart.GetMenuBigCart);
            $("body").on("click", ".cart-preview-item__remove", BAPS.MenuCart.Remove);
            $("body").on("click", ".cart-preview__close", BAPS.MenuCart.Close);
        }
        //else {
        //    $('.util-nav__item--cart a.util-nav__link').off('click');     
        //}
    };

    BAPS.MenuCart.GetMenuBabyCart = function () {
        BAPS.console.log('GetMenuBabyCart');
        BAPS.Ajax.GetHTML(
            BAPS.Routes.MenuBabyCart,
            { loadBigCart: true },
            function (data) {
                $(".util-nav__item--cart").replaceWith(data);

                //$('.header').data('gknav').resetNav();

                BAPS.MenuCart.ShowCorrectCart();
            },
            null
        );
    };

    BAPS.MenuCart.GetMenuBigCart = function () {
        BAPS.console.log('GetMenuBigCart');
        // only reload if the relevant element is empty
        if ($(".cart-preview").children().length === 0) {
            BAPS.Ajax.GetHTML(
                BAPS.Routes.MenuBigCart,
                null,
                function (data) {
                    $(".cart-preview").append(data);

                    BAPS.MenuCart.ShowCorrectCart();

                    BAPS.Analytics.ViewCart();
                },
                null
            );
        }
    };

    BAPS.MenuCart.Remove = function () {
        var data = {
            EventNumberEQS: $(this).data("eventnumbereqs"),
            RecordIDEQS: $(this).data("Recordideqs"),
            ProductCodeEQS: $(this).data("productcodeeqs")
        };
        BAPS.Ajax.PostFormGetJson(BAPS.Routes.DeleteFromBasket,
            data,
            function (resultData) {
                BAPS.MenuCart.GetMenuBabyCart();
            }
        );
    };

    BAPS.MenuCart.Close = function (event) {
        var li = $(this).parents('.util-nav__item--cart');
        BAPS.MenuCart.CloseCartNavItem(li);
    };

    BAPS.MenuCart.ShowCorrectCart = function (event) {
        var li = $('.util-nav__item--cart');

        if ($(document).scrollTop() == 0) {
            ulClass = "util-nav";
        } else {
            ulClass = "main-nav__list"
        }

        var ul = null;
        var goodLi = null;
        li.each((i, myLi) => {
            ul = $(myLi).parents("." + ulClass);
            if (ul.length > 0) {
                goodLi = $(myLi);
                return false;
            }
        })

        if (goodLi !== null) {
            BAPS.MenuCart.OpenCartNavItem(goodLi);
        }
    };

    BAPS.MenuCart.CartNavItemClick = function (e) {
        e.preventDefault();

        var li = $(this).parents('.util-nav__item--cart');
        var ul = li.parents('ul');

        if (ul.hasClass('main-nav__list')) {
            if (li.hasClass('active2')) {
                BAPS.MenuCart.CloseCartNavItem(li);
            }
            else {
                BAPS.MenuCart.OpenCartNavItem(li);
            }
        } else if (ul.hasClass('util-nav')) {
            if (li.hasClass('active')) {
                BAPS.MenuCart.CloseCartNavItem(li);
            }
            else {
                BAPS.MenuCart.OpenCartNavItem(li);
            }
        }
    };

    BAPS.MenuCart.OpenCartNavItem = function (li) {
        li.addClass('active2');
        li.addClass('active')
            .find('.util-nav__dropdown')
            .attr('aria-hidden', false);

        $('body').addClass('cart-focus');
    };

    BAPS.MenuCart.CloseCartNavItem = function (li) {
        li.removeClass('active2');
        li.removeClass('active')
            .find('.util-nav__dropdown')
            .attr('aria-hidden', true);

        $('body').removeClass('cart-focus');
    };
}