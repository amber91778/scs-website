/* 
JavaScript for BAPS 
*/
var BAPS = null;

function BAPSObject($) {
    if (BAPS !== null) {
        BAPS.console.log('Reuse');
        return BAPS;
    }

    BAPS = this;
    BAPS.Debug = false;
    BAPS.DebugLogResponse = false;
    BAPS.$ = $;
    BAPS.Core = {};

    /* Private console logging function */
    BAPS.console = {};
    BAPS.console.log = function (message) {
        if (BAPS.Debug) {
            console.log(message);
        }
    };

    BAPS.console.log('Create');

    BAPS.elementExists = function (selector) {
        if ($(selector).length) {
            return true;
        }
        else {
            return false;
        }
    };

    BAPS.coreInit = function () {
        $("body").on("click", ".close_modal", BAPS.Core.CloseModal);
        //$('body').on('click', '.close_modal', BAPS.Core.CloseModal);   
    };   
    /* Init other bits */
    //BAPS.table2csv($);

    BAPS.analyticsInit($);  
    BAPS.ajaxInit($);
    BAPS.accountInit($);  
    BAPS.coursesInit($);
    BAPS.productOverviewInit($);
    BAPS.cartInit($);
    BAPS.iConnectInit($);
    BAPS.ProviderInit($);
    BAPS.productOverviewInit($);
    BAPS.MenuCartInit($);
    BAPS.StateInit($);



    /* RETURN MODELS */
    BAPS.BAPSSimpleResponseObject = function (Success) {
        this.Success = Success;
    };

    BAPS.Core.Remove = function (element, callback) {
        element.fadeOut(function () {
            $(this).remove();

            if (callback !== undefined) {
                callback();
            }
        });
    };

    BAPS.Core.Hide = function (element) {
        element.fadeOut();
    };

    BAPS.Core.Show = function (element) {
        element.fadeIn();
    };

    //BAPS.Core.saveAlert = new SaveAlert(); 

    BAPS.Core.ErrorAlert = function (message) {
        //alert(message);
        //BAPS.Core.saveAlert._trigger(false, message);
        if (message === null || message.length == 0) {
            message = "An unexpected error has occured. Please try again later";
        }

        window.savealert._trigger(false, message);
    };

    BAPS.Core.SuccessAlert = function (message) {
        //alert(message);
        //BAPS.Core.saveAlert._trigger(true, message);
        window.savealert._trigger(true, message);
    };

    // launches a generic yes no modal popup
    BAPS.Core.YesNoModal = function (selector, yesCallback) {
        var modal = $('.yes-no-modal' + selector);

        BAPS.console.log(modal);

        var yesBut = modal.find('.yesBut');

        yesBut.on('click', function () {
            yesCallback();
            BAPS.Core.CloseModal();
            yesBut.off('click');
        });

        var noBut = modal.find('.noBut');

        noBut.on('click', function () {
            BAPS.Core.CloseModal();
            noBut.off('click');
        });

        BAPS.Core.OpenModal(modal);
    };

    // This is for Pagination
    BAPS.Core.GetPageNo = function (event) {
        var pageNumber = 0;

        var target = $(event.target);
        if (target.closest(".paginate__item").length === 1) {
            if (target.hasClass("paginate__button")) {
                pageNumber = target.attr("pageNo");
            }
            else {
                pageNumber = target.closest("button").attr("pageNo");
            }
        }

        if (pageNumber === 0) {
            // don't want to allow page 0 as this is view all!
            // if view allis require it will be done with a dedicated link
            pageNumber = 1;
        }

        return pageNumber;
    };

    // This is for Pagination
    BAPS.Core.GetSetFormPageNo = function (event, form, pageNumber) {
        if (form.data('saveStateOnComplete') || form.data('saveStateOnComplete') === undefined) {
            if (pageNumber === null || typeof pageNumber === "undefined") {
                pageNumber = BAPS.Core.GetPageNo(event);
            }

            BAPS.Core.SetFormPageNo(form, pageNumber);
        }
    };

    // This sets the (and creates if missing) the forms pagenumber hidden.
    BAPS.Core.SetFormPageNo = function (form, pageNumber) {
        var pageNoHdn = form.find('input[type="hidden"][name="PageNo"]');

        if (pageNoHdn.length === 0) {
            pageNoHdn = $('<input type="hidden" name="PageNo" />');
            pageNoHdn.appendTo(form);
        }

        pageNoHdn.val(pageNumber);
    };

    //BAPS.Core.ShowMenuCart = function () {
    //    window.scrollTo(0, 0);
    //    gkcart.resetCartPreview();
    //    gkcart.showCartPreview();
    //}

    BAPS.Core.ReattachCheckboxes = function () {
        //window.gkcheckbox(); // this does not work! All the Verndale module 'collect' as list of elements when loaded which doe snot work for ajax calls.
        $('.checkbox__input').checkbox();
    };

    BAPS.Core.DataObjectArrayToList = function (data, property) {
        var listName = property.split(".")[0];
        var propName = property.split(".")[1];

        var listData = new Array();

        if (Array.isArray(data[property])) {
            $.each(data[property], function () {
                value = this;
                if (value !== null) {
                    var childItem = {}; //= { propName: value };
                    childItem[propName] = value;

                    listData.push(childItem);
                }
            });
        }
        else {
            // Beware, the data we've received isn't an array but we still want the array structure for data submission.
            var childItem = {};
            childItem[propName] = data[property];
            listData.push(childItem);
        }

        delete data[property];
        data[listName] = listData;

        return data;
    };

    BAPS.Core.Flatten = function (input, output, prefix, includeNulls) {
        if ($.isPlainObject(input)) {
            for (var p in input) {
                if (includeNulls === true || typeof (input[p]) !== "undefined" && input[p] !== null) {
                    BAPS.Core.Flatten(input[p], output, prefix.length > 0 ? prefix + "." + p : p, includeNulls);
                }
            }
        }
        else {
            if ($.isArray(input)) {
                $.each(input, function (index, value) {
                    BAPS.Core.Flatten(value, output, "{0}[{1}]".format(prefix, index));
                });

                return;
            }

            if (!$.isFunction(input)) {
                if (input instanceof Date) {
                    output.push({ name: prefix, value: input.toISOString() });
                }
                else {
                    var val = typeof (input);
                    switch (val) {
                        case "boolean":
                        case "number":
                            val = input;
                            break;
                        case "object":
                            // this property is null, because non-null objects are evaluated in first if branch
                            if (includeNulls !== true) {
                                return;
                            }
                        default:
                            val = input || "";
                    }

                    output.push({ name: prefix, value: val });
                }
            }
        }
    };

    BAPS.Core.ToDictionary = function (data, prefix, includeNulls) {
        /// <summary>Flattens an arbitrary JSON object to a dictionary that Asp.net MVC default model binder understands.</summary>
        /// <param name="data" type="Object">Can either be a JSON object or a function that returns one.</data>
        /// <param name="prefix" type="String" Optional="true">Provide this parameter when you want the output names to be prefixed by something (ie. when flattening simple values).</param>
        /// <param name="includeNulls" type="Boolean" Optional="true">Set this to 'true' when you want null valued properties to be included in result (default is 'false').</param>

        // get data first if provided parameter is a function
        data = $.isFunction(data) ? data.call() : data;

        // is second argument "prefix" or "includeNulls"
        if (arguments.length === 2 && typeof (prefix) === "boolean") {
            includeNulls = prefix;
            prefix = "";
        }

        // set "includeNulls" default
        includeNulls = typeof (includeNulls) === "boolean" ? includeNulls : false;

        var result = [];
        BAPS.Core.Flatten(data, result, prefix || "", includeNulls);

        return result;
    };

    BAPS.Core.GetFormAction = function (form) {
        return $(form).attr('action');
    };

    BAPS.Core.GetRouteFromFormAction = function (form) {
        var action = BAPS.Core.GetFormAction(form);
        return BAPS.Core.Resolve(action);
    };

    // from https://stackoverflow.com/a/24514304
    BAPS.Core.Resolve = function (path, obj) {
        return path.split('.').reduce(function (prev, curr) {
            return prev ? prev[curr] : null;
        }, obj || self);
    };

    BAPS.Core.MergeTemplateAndObject = function (template, object) {
        var keys = Object.keys(object);

        $.each(keys, function () {
            key = this;
            //template = template.replace('{' + key + '}', object[key]);
            template = BAPS.Core.ReplaceTemplateString(template, key, object[key]);
        });

        return template;
    };

    BAPS.Core.ReplaceTemplateString = function (template, key, string) {
        //return template.replace('{' + key + '}', string); // only handles the first occurance
        return template.split('{' + key + '}').join(string); // this handles multiple occurances of a key!
    };

    $.prototype.serializeObject = function () {
        var arrayData, objectData;
        arrayData = this.serializeArray();
        objectData = {};

        $.each(arrayData, function () {
            var value;

            if (this.value !== null) {
                value = this.value;
            } else {
                value = '';
            }

            if (objectData[this.name] !== undefined) {
                if (!objectData[this.name].push) {
                    objectData[this.name] = [objectData[this.name]];
                }

                objectData[this.name].push(value);
            } else {
                objectData[this.name] = value;
            }
        });

        return objectData;
    };

    BAPS.Core.OpenModal = function (target, mainClass) {
        $.magnificPopup.open(
            {
                items: { src: target, type: 'inline' },
                mainClass: mainClass
            },
            0
        );
    };

    BAPS.Core.CloseModal = function () {
        $.magnificPopup.close();
    };

    BAPS.Core.PaginateTable = function (table) {
        table.next('.paginate').remove();
        var currentPage = 0;
        var numPerPage = 10;

        var numRows = table.find('tbody tr').length;
        var numPages = Math.ceil(numRows / numPerPage);

        if (numPages > 1) {
            table.bind('repaginate', function () {
                table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
            });
            table.trigger('repaginate');

            //var $pageroutCont = $('<div class="userpager"></div>');
            var $pagerCont = $('<div class="paginate"></div>');
            //$pagerCont.appendTo($pageroutCont);
            var $pager = $('<ul class="paginate__list"></ul>');
            $pager.appendTo($pagerCont);

            for (var page = 0; page < numPages; page++) {
                var li = $('<li class="paginate__item"></li>');
                $('<button class="paginate__button"></button>').text(page + 1).bind('click', {
                    newPage: page
                }, function (event) {
                    currentPage = event.data['newPage'];
                    table.trigger('repaginate');
                    var li = $(this).parent();
                    li.addClass('paginate__item--active').siblings().removeClass('paginate__item--active');
                    event.preventDefault();
                }).appendTo(li);
                li.appendTo($pager).addClass('clickable');
            }

            $pagerCont.insertAfter(table).find('li.paginate__item:first').addClass('paginate__item--active');
        }
    };


    BAPS.Core.ValidateForm = function (form, externalAddError, externalRemoveError) {
        BAPS.console.log("BAPS.Core.ValidateForm");
        var valid = true;

        // make the errors go away before reintroducing them
        removeError(form);

        //BAPS.console.log($("#errorBlankGeneric"));
        //BAPS.console.log(window.errorMessages);
        //BAPS.console.log(window.errorMessages.test);
        //BAPS.console.log(window.errorMessages.required);
        BAPS.console.log(window.errorMessages ? window.errorMessages.required : $("#errorBlankGeneric").val());

        // get visible, required and enabled input elephants
        $(form).find('input[required]:enabled:visible').each(function (index) {
            var element = $(this);
            if (element.val() === "") {
                addError(element, window.errorMessages ? window.errorMessages.required : $("#errorBlankGeneric").val());
                valid = false;
            }
        });

        // now do a basic check on email format if email has been supplied
        //BAPS.console.log("input[type='email']");
        $(form).find("input[type='email']").each(function (index) {
            var element = $(this);
            if (!BAPS.Core.ValidateEmail(element.val())) {
                addError(element, window.errorMessages ? window.errorMessages.invalidEmail : $("#errorBadEmail").val());
                valid = false;
            }
        });

        // now check that fields that must match other fields match other fields
        $(form).find("input[data-match]").each(function (index) {
            var secondElement = $(this); // the data-match element occurs after the one it's supposed to match 
            var dataMatchName = secondElement.attr("data-match");
            var firstElement = $("input[name='" + dataMatchName + "']");
            var firstVal = firstElement.val().trim();
            var fieldType = firstElement.attr("type");
            var secondVal = secondElement.val().trim();
            if (firstVal !== secondVal) {
                var errorMessage = $("#errorMismatchGeneric").val();
                if (fieldType === "password") {
                    errorMessage = window.errorMessages ? window.errorMessages.passwordMatch : $("#errorMismatchPassword").val()
                }
                if (fieldType === "email") {
                    errorMessage = window.errorMessages ? window.errorMessages.emailMatch : $("#errorMismatchEmail").val()
                }
                addError(firstElement, errorMessage);
                addError(secondElement, errorMessage);
                valid = false;
            }
        });

        function addError(inputElement, errorMessage) {
            if (externalAddError) {
                externalAddError(inputElement, errorMessage);
            }
            else {
                defaultAddError(inputElement, errorMessage);
            }
        }

        function defaultAddError(inputElement, errorMessage) {
            inputElement.closest('li').addClass('has-error');
            inputElement.closest('li').find(".error-label").text(errorMessage);
        }

        function removeError(form) {
            if (externalRemoveError) {
                externalRemoveError(form);
            }
            else {
                defaultRemoveError(form);
            }
        }

        function defaultRemoveError(form) {
            $(form).find('li').removeClass('has-error');
        }

        BAPS.console.log("Validation Result");
        BAPS.console.log(valid);

        return valid;
    };


    BAPS.Core.ValidateEmail = function (email) {
        if (email === "") {
            // empty string can be validated elsewhere
            return true;
        }
        else {
            // regex doesn't cut it. Check for something @ something dot something
            var emailSegments = email.split("@");
            if (emailSegments.length === 2) {
                var domainSegments = emailSegments[1].split(".");
                if (domainSegments.length > 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    };

    // this ahs to be last!
    BAPS.coreInit($);
}

