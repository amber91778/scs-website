BAPSObject.prototype.ProviderInit = function ($) {
    // bail out if there's no element with a provider class
    if (!BAPS.elementExists('.provider')) {
        return;
    }

    BAPS.Provider = {};
    
    $(document).ready(function () {
        BAPS.Provider.AttachLogin();
        BAPS.Provider.AttachEvents();
        BAPS.Provider.AttachCourseAddEdit();
        BAPS.Provider.AttachLocationEdit();
        BAPS.Provider.AttachReports();
        BAPS.Provider.AttachBulkUpload();
    });
    
    BAPS.Provider.AttachLogin = function () {
        $('.providerlogin-module__form').on('submit', BAPS.Provider.ProviderLogin);
    }

    BAPS.Provider.AttachCourseAddEdit = function () {
        $(".providerCourseEdit").on("change", "select[name='Entity.ClassCode']", BAPS.Provider.UpdateBrandList);
        $(".providerCourseEdit").on("submit", ".providerCourseEditForm", BAPS.Provider.ProviderCourseAddEdit);
        $(".providerCourseEdit").on("click", "#btnArchive", BAPS.Provider.ProviderCourseArchive);
        $(".providerCourseEdit .richText").rtEditor();

        $(".providerCourseAdd").on("change", "select[name='Entity.ClassCode']", BAPS.Provider.UpdateBrandList);
        $(".providerCourseAdd").on("submit", ".providerCourseAddForm", BAPS.Provider.ProviderCourseAddEdit);
        $(".providerCourseAdd .richText").rtEditor();

        $('#OnlyActiveCourses').on('click', BAPS.Provider.ProviderCourseSearch);
    }

    BAPS.Provider.AttachLocationEdit = function () {
        $(".providerLocationEdit").on("submit", ".providerLocationEditForm", BAPS.Provider.ProviderLocationEdit);
    }

    BAPS.Provider.AttachReports = function () {
        $(".provider-wrapper").on("submit", ".provider-reports", BAPS.Provider.ProviderRunReport);
    }

    BAPS.Provider.AttachEvents = function () {
        //$('#provider_eventListSearch').on('submit', BAPS.Provider.ProviderEventSearch);

        $('.providerEventList #OnlyFutureEvents').on('change', BAPS.Provider.TriggerProviderEventSearch);
        $('.providerEventList #CourseCodeEQS').on('change', BAPS.Provider.TriggerProviderEventSearch);
        $('.providerEventList #OnlyActiveCourses').on('change', BAPS.Provider.TriggerProviderCourseSearch);
        $('.provider').on('click', '.paginate', BAPS.Provider.ProviderPaginationDispatcher);
        //$('#provider_eventListSearch .selectized')[0].selectize.on('item_add', BAPS.Provider.ProviderEventSearch);

        $(".providerEventAddEdit").on("change", "select[name='Entity.CourseCodeEQS']", BAPS.Provider.GetProviderCourseDetailsJSON);

        $(".providerEventAddEdit").on("submit", "#providerAddEditForm", BAPS.Provider.EventSave);
        $(".providerEventAddEdit").on("click", "#providerAddEditCancel", BAPS.Provider.EventCancel);
        $(".providerEventAddEdit").on("click", "#providerAddEditHold", BAPS.Provider.EventHold);

    }

    BAPS.Provider.AttachBulkUpload = function () {

        //Public Property FileID As String
        //Public Property Name As String
        //Public Property Status As String
        //Public Property Rows As Integer
        //Public Property FileType As String
        //Public Property UploadDate As Date
        //Public Property ProcessedDate As Date
        //Public Property File As Byte()

        $('#fileupload').fileupload({
            url: '/' + BAPS.Ajax.getCulturePath() + BAPS.Routes.ProviderBulkUpload,
            dataType: 'json',
            done: function (e, data) {
                var result = data.response().result;
                BAPS.console.log(result);
                if (result.Success) {
                    BAPS.Core.SuccessAlert(result.ErrorMessage);

                    $('.completedMessage').text(result.ErrorMessage);
                    BAPS.Core.Hide($('.choose'));
                    BAPS.Core.Show($('.choosen'));
                }
                else {
                    BAPS.Core.ErrorAlert(result.ErrorMessage);
                } 
            },
            fail: function (e, data) {
                BAPS.Ajax.redirectForAuthentication(data.jqXHR);

                BAPS.Provider.ResetBulkUpload();
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);

                var uiProg = $('.acct-course__progress .acct-course__progress-inner');

                uiProg.css(
                    'width',
                    progress + '%'
                );

                BAPS.Core.Show(uiProg);
            }
        })

        $('.choosen a').click(function (event) {
            event.preventDefault();
            BAPS.Provider.ResetBulkUpload();
        });

        $('.bulk-results').on('click', 'a.download-bulk-result', BAPS.Provider.ProviderBulkUploadResults)
    }

    BAPS.Provider.ResetBulkUpload = function () {
        var uiProg = $('.acct-course__progress .acct-course__progress-inner');

        uiProg.css(
            'width',
            '0%'
        );

        BAPS.Core.Hide(uiProg);
        BAPS.Core.Show($('.choose'));
        BAPS.Core.Hide($('.choosen'));
    }

    BAPS.Provider.ProviderPaginationDispatcher = function (event) {
        var parent = $(this).parents('.course-paginate');

        if (parent.hasClass('provider-events')) {
            BAPS.Provider.ProviderEventSearch(event);
        }
        else if (parent.hasClass('provider-courses')) {
            BAPS.Provider.ProviderCourseSearch(event);
        }
        else if (parent.hasClass('provider-bulkupload')) {
            BAPS.Provider.ProviderBulkUploadSearch(event);
        }
        else if (parent.hasClass('provider-locations')) {
            BAPS.Provider.ProviderLocationSearch(event);
        }
    }

    BAPS.Provider.ProviderBulkUploadResults = function (event) {
        event.preventDefault();

        var data = { FileID : $(this).data('id')};

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.ProviderBulkUploadFileDetail,
            data,
            BAPS.Ajax.defaultRedirectOrErrorHandler
        );
    }

    BAPS.Provider.EventSave = function (event) {
        event.preventDefault();
        if (!BAPS.Core.ValidateForm(this, BAPS.Provider.AddFormError, BAPS.Provider.RemoveFormErrors)) {
            return false;
        }

        var dataToSend = $("#providerAddEditForm").serializeObject();
        dataToSend['Entity.StartDate'] = dataToSend['Entity.StartDate_submit'];
        dataToSend['Entity.EndDate'] = dataToSend['Entity.EndDate_submit'];
        
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.providerEventAddEdit,
            dataToSend,
            BAPS.Ajax.defaultRedirectOrErrorHandler
        );
    }

    BAPS.Provider.EventCancel = function (event) {
        event.preventDefault();
        // these two lines are cosmetic
        $("input#Cancelled").prop('disabled', false);
        $("input#Cancelled").prop("checked", true);
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.providerEventCancel,
            $("#providerAddEditForm").serializeObject(),
            BAPS.Ajax.defaultRedirectOrErrorHandler
        );
    }

    BAPS.Provider.EventHold = function (event) {
        event.preventDefault();
        $("input#OnHold").prop("checked", true);
        $("#providerAddEditForm").submit();
    } 

    BAPS.Provider.UpdateBrandList = function (event) {
        var brands = (function (brandJSON, classCode) {
            var ret = null;
            for (i = 0; i < brandJSON.length; i++) {
                if (brandJSON[i].ClassCode == classCode)
                {
                    ret = brandJSON[i].Brands;
                }
            }
            return ret;
        })(brandJSON, $(this).val());
        $("select#SubGroup option[value!='']").remove();
        for (i = 0; i < brands.length; i++) {
            BAPS.console.log(brands[i].Code);
            $("select#SubGroup").append($("<option value=\"" + brands[i].Code + "\">" + brands[i].Description + "</option>"));
        }
    }

    BAPS.Provider.ProviderCourseArchive = function (event) {
        event.preventDefault();
        $("input[name='Entity.Archive']").val("True");
        $(".providerCourseEditForm").submit();
    }

    BAPS.Provider.ProviderCourseAddEdit = function (event) {
        event.preventDefault();

        var dataToSend = $(this).serializeObject();

        BAPS.console.log(dataToSend);

        if (!BAPS.Core.ValidateForm(this, BAPS.Provider.AddFormError, BAPS.Provider.RemoveFormErrors)) {
            return false;
        }

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.providerCourseAddEdit,
            dataToSend,
            BAPS.Ajax.defaultRedirectOrErrorHandler
        );

    }

    BAPS.Provider.ProviderCourseFieldIsBlank = function (fieldVal, message) {
        if (fieldVal.trim() === "")
        {
            BAPS.Core.ErrorAlert(message);
            return true;
        }
        return false;
    }

    BAPS.Provider.ProviderLogin = function (event) {
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.providerLogin,
            $(this).serializeObject(),
            function (resultData) {
                if (resultData.Success && resultData.ReturnUrl != "")
                {
                    document.location.href = resultData.ReturnUrl;
                }
                else
                {
                    BAPS.Core.ErrorAlert($("#loginError").val());
                }
            }
        );
        event.preventDefault();
    }

    BAPS.Provider.TriggerProviderEventSearch = function (event) {
        BAPS.Provider.ProviderEventSearch(event, 1);
    }

    BAPS.Provider.TriggerProviderCourseSearch = function (event) {
        BAPS.Provider.ProviderCourseSearch(event, 1);
    }

    BAPS.Provider.ProviderEventSearch = function (event, pageNo) {
        if (pageNo === null || typeof pageNo === "undefined") {
            pageNo = BAPS.Core.GetPageNo(event);
        }

        var data = {};
        data.OnlyFutureEvents = $('#OnlyFutureEvents').is(':checked');
        data.CourseCodeEQS = $('#CourseCodeEQS').val();
        data.PageNo = pageNo;

        BAPS.Ajax.PostHTML(
            BAPS.Routes.providerEventListResults,
            data,
            function (resultData) {
                $('div.provider-wrapper .results').replaceWith(resultData);
            }
        );
    }

    BAPS.Provider.ProviderCourseSearch = function (event, pageNo) {
        if (pageNo === null || typeof pageNo === "undefined") {
            pageNo = BAPS.Core.GetPageNo(event);
        }

        var data = {};
        data.OnlyActive = $('#OnlyActiveCourses').is(':checked');
        data.PageNo = pageNo;

        BAPS.Ajax.PostHTML(
            BAPS.Routes.providerCourseListResults,
            data,
            function (resultData) {
                $('div.provider-wrapper .results').replaceWith(resultData);
            }
        );
    }

    BAPS.Provider.ProviderBulkUploadSearch = function (event, pageNo) {
        if (pageNo === null || typeof pageNo === "undefined") {
            pageNo = BAPS.Core.GetPageNo(event);
        }

        var data = {};
        data.PageNo = pageNo;

        BAPS.Ajax.PostHTML(
            BAPS.Routes.ProviderBulkUploadListResults,
            data,
            function (resultData) {
                $('div.provider-wrapper .results').replaceWith(resultData);
            }
        );
    }

    BAPS.Provider.ProviderLocationSearch = function (event, pageNo) {
        if (pageNo === null || typeof pageNo === "undefined") {
            pageNo = BAPS.Core.GetPageNo(event);
        }

        var data = {};
        data.PageNo = pageNo;

        BAPS.Ajax.PostHTML(
            BAPS.Routes.ProviderLocationListResults,
            data,
            function (resultData) {
                $('div.provider-wrapper .results').replaceWith(resultData);
            } 
        );
    }
    
    BAPS.Provider.ProviderLocationEdit = function (event) {
        event.preventDefault();

        if (!BAPS.Core.ValidateForm(this, BAPS.Provider.AddFormError, BAPS.Provider.RemoveFormErrors)) {
            return false;
        }

        var form = $(this);
        var data = form.serializeObject();

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.ProviderLocationEdit,
            data,
            BAPS.Ajax.defaultRedirectOrErrorHandler
        );
    }

    BAPS.Provider.ProviderRunReport = function (event) {
        event.preventDefault();

        if (!BAPS.Core.ValidateForm(this, BAPS.Provider.AddFormError, BAPS.Provider.RemoveFormErrors)) {
            return false;
        }

        var form = $(this);
        var data = form.serializeObject();
        data.DateFrom = data.DateFrom_submit;
        data.DateTo = data.DateTo_submit;

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.ProviderRunReport,
            data,
            BAPS.Ajax.defaultRedirectOrErrorHandler
        );
    }

    BAPS.Provider.GetProviderCourseDetailsJSON = function (event) {
        event.preventDefault();

        var corseCode = courseCodeMap[$(this).val()];

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.providerCourseDetailsJSON,
            { Code: corseCode },
            function (data)
            {
                $("input[name='Entity.Duration']").val(data.Duration);
                $("input[name='StartTime']").val(data.StartTimeSimpleString);
                $("input[name='EndTime']").val(data.EndTimeSimpleString);
                $("input[name='Entity.Price']").val(data.Price);
                $("input[name='Entity.MinPlaces']").val(data.MinPlaces);
                $("input[name='Entity.MaxPlaces']").val(data.MaxPlaces);
                $("input[name='Entity.ImmediatePlaces']").val(data.ImmediatePlaces || 0);

                if (!data.Active) {
                    BAPS.Core.Show($('#inactive-error'));
                }
                else {
                    BAPS.Core.Hide($('#inactive-error'));
                }
                
                $(".hideForAdd").removeClass("hideForAdd");
            }
        );
    }

    /* These are used to override the default form error show and hide methods used in the BAPS.Core.ValidateForm method */
    BAPS.Provider.AddFormError = function(inputElement, errorMessage) {
        var errorDiv = $("<div class=\"errorMessage\"></div>");
        var li = inputElement.closest("li");
        li.addClass("has-error");
        li.append(errorDiv);
        errorDiv.append(errorMessage);
    }

    BAPS.Provider.RemoveFormErrors = function(form) {
        $(form).find("li").removeClass("has-error");
        $(form).find("li div.errorMessage").remove();
    }


}