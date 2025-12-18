BAPSObject.prototype.productOverviewInit = function ($) {
    // Shortcut out if not required.
    if (!this.elementExists('.product-overview-wrap')) {
        return;
    }
    //BAPS = this;
    BAPS.ProductOverview = {};

    $(document).ready(function () {
        //BAPS.ProductOverview.AttachProductOverview();
    });

    //BAPS.ProductOverview.AttachProductOverview = function () {
    //    $(".product-overview-wrap").on("click", ".course-heading__main-link, .course-heading__mobile-link", BAPS.ProductOverview.AddToCartButtonClicked);
    //}

    // this feels like a weird way of wiring this up but it'll probably work.
    BAPS.ProductOverview.AddToCartButtonClicked = function (event) {
        //event.preventDefault();
        var data = $(".product__form").serializeObject();
        BAPS.Courses.addToCart(data, BAPS.ProductOverview.AddToCartCallback);
    }

    BAPS.ProductOverview.AddToCartCallback = function () {
        BAPS.MenuCart.GetMenuBabyCart();
    }

}