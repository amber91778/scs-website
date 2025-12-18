BAPSObject.prototype.coursesInit = function ($) {
    // Shortcut out if not required.
    //if (!this.elementExists('')) {
    //    return;
    //}
    //BAPS = this;
    BAPS.Courses = {};

    $(document).ready(function () {
        BAPS.Courses.AttachCourseOverview();
        BAPS.Courses.AttachSpecialEvents();
    });

    BAPS.Courses.DataKeys = {
        CourseCode: 'coursecode'
    };

    BAPS.Courses.AttachCourseOverview = function () {
        if (!BAPS.elementExists('.course-overview-wrap') && !BAPS.elementExists('.instance-content')) {
            return;
        }

        $(".course-overview-wrap").on("click", ".overview-schedule__submit", BAPS.Courses.AddToCartButtonClicked);
        $(".instance-content").on("click", ".instance__submit", BAPS.Courses.AddToCartButtonClicked);

        // buy elearning (this is a product shown on the course page)
        $(".course-overview-wrap").on("click", ".course-heading__main-link, .course-heading__mobile-link", BAPS.Courses.AddElearningToCartButtonClicked);

        $('.overview-schedule__others').on('mfpBeforeOpen', function (e) {
            BAPS.Courses.DatesOtherCountries(this);
        });
    };

    BAPS.Courses.AttachSpecialEvents = function () {
        if (!BAPS.elementExists('.special-events')) {
            return;
        }

        $('.special-events .filter-checkbox__input').on('change', function (e) {
            var parent = $(e.target).parent();
            e.target.checked ? parent.addClass('active') : parent.removeClass('active');
        });

        $('.special-events').on("click", '.instance__submit', BAPS.Courses.AddToCartButtonClicked);

        $('form.schedule-filters').on('submit', BAPS.Courses.SpecialEventsSearchSubmit);

        $('.special-events').on('click', '.paginate', BAPS.Courses.SpecialEventsSearch);

        $('.special-events').on('change', '#SortBy', BAPS.Courses.SpecialEventsSearchSubmit);
    };

    function BAPSPublicEventSearchResponseObject(Success, Content, ErrorMessage) {
        this.Success = Success;
        this.Content = Content;
        this.ErrorMessage = ErrorMessage;
    }

    function BAPSRequestSpaceResponseObject(Success, ReturnURL, ErrorMessage) {
        this.Success = Success;
        this.ReturnURL = ReturnURL;
        this.ErrorMessage = ErrorMessage;
    }

    BAPS.Courses.addToCart = function (data, callback) {
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.AddToCart,
            data,
            callback,
            null
        );
    };

    // this feels like a weird way of wiring this up but it'll probably work.
    BAPS.Courses.AddToCartButtonClicked = function (event) {
        event.preventDefault();
        var data = $(this).closest("form").serializeObject();
        BAPS.Courses.addToCart(data, BAPS.MenuCart.GetMenuBabyCart);
    };

    BAPS.PublicEventSearch = function (publicEventSearchModel, callback) {
        publicEventSearchModel.MergeEventsInOtherCountries = true;

        //If the centre EQS has a source DB prepended then split it out into a seperate property.
        $.each(publicEventSearchModel.Centres, function (index, value) {
            value.DBCode = value.CentreIdEQS.split('_')[0];
            value.CentreIdEQS = value.CentreIdEQS.split('_')[1];
        });

        BAPS.Ajax.PostHTMLUsingJson(
            BAPS.Routes.CoursePublicEventSearch,
            publicEventSearchModel,
            function (data) {
                callback(new BAPSPublicEventSearchResponseObject(true, data, ""));
            },
            function (errorThrown) {
                callback(new BAPSPublicEventSearchResponseObject(false, "", errorThrown));
            }
        );
    };

    BAPS.Courses.DatesOtherCountries = function (sender) {
        var modal = $('#request-space');

        if (!modal.hasClass('loaded')) {
            // load other dates
            var data = {
                CourseCode: $(sender).data(BAPS.Courses.DataKeys.CourseCode)
            };

            BAPS.Ajax.PostHTML(
                BAPS.Routes.DatesOtherCountries,
                data,
                function (result) {
                    modal.html(result);

                    window.gktooltip(modal);

                    modal.addClass('loaded');
                }
            );
        }

    };

    BAPS.RequestSpace = function (requestSpaceModel, callback) {
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.RequestSpace,
            requestSpaceModel,
            function (data) {
                callback(new BAPSRequestSpaceResponseObject(true, data.ReturnUrl, ""));
            },
            function (errorThrown) {
                callback(new BAPSRequestSpaceResponseObject(false, "", errorThrown));
            }
        );
    };

    BAPS.Courses.AddElearningToCartButtonClicked = function (event) {
        event.preventDefault();
        var data = $(".product__form").serializeObject();
        BAPS.Courses.addToCart(data, BAPS.MenuCart.GetMenuBabyCart);
    };

    BAPS.Courses.SpecialEventsSearchSubmit = function (event) {
        BAPS.Courses.SpecialEventsSearch(event, 1);
    };

    BAPS.Courses.SpecialEventsSearch = function (event, pageNo) {
        var form = $('form.schedule-filters');
        BAPS.Core.GetSetFormPageNo(event, form, pageNo);

        event.preventDefault();

        var data = form.serializeObject();

        var sorting = $("select#SortBy").val();
        data.SortDirection = sorting.split('-')[1];
        data.OrderBy = sorting.split('-')[0];

        // clean all strings
        if (data["Centres.CentreIdEQS"] == -1) {
            delete data["Centres.CentreIdEQS"];
        }
        else {
            data = BAPS.Core.DataObjectArrayToList(data, "Centres.CentreIdEQS");
        }

        if (data.Classes == -1) {
            delete data.Classes;
        }

        if (data.TechTypes == -1) {
            delete data.TechTypes;
        }
        BAPS.console.log(Array.isArray(data.DeliveryTypes));
        if (data.DeliveryTypes != undefined && !Array.isArray(data.DeliveryTypes)) {
            data.DeliveryTypes = [data.DeliveryTypes];
        }
        BAPS.console.log(Array.isArray(data.DeliveryTypes));

        BAPS.Ajax.PostHTMLUsingJson(
            BAPS.Routes.PublicEventSearch,
            data,
            function (data) {
                $('.schedule-content').replaceWith(data);
                $("select#SortBy").filterDropdown();
            }
        );
    };
};