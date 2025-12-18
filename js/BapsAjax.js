BAPSObject.prototype.ajaxInit = function ($) {
    //BAPS = this;
    BAPS.Ajax = {};

    BAPS.Ajax.PostJsonGetJson = function (action, data, callback, errorcallback, showLoading, doNotHideLoading) {
        BAPS.Ajax.CallCore('', callback, 'json', 'POST', data, action, showLoading, errorcallback, doNotHideLoading, true);
    };

    BAPS.Ajax.PostFormGetJson = function (action, data, callback, errorcallback, showLoading, doNotHideLoading) {
        BAPS.Ajax.CallCore('', callback, 'json', 'POST', data, action, showLoading, errorcallback, doNotHideLoading);
    };

    BAPS.Ajax.GetJson = function (action, data, callback, errorcallback, showLoading) {
        BAPS.Ajax.CallCore('', callback, 'json', 'GET', data, action, showLoading, errorcallback);
    };

    //this.Ajax PostFormGetJsonLoading = function(action, data, callback) {
    //    AjaxCallCore('', callback, 'json', 'POST', data, action, true);
    //}

    BAPS.Ajax.GetHTML = function (action, data, callback, errorcallback, showLoading) {
        BAPS.Ajax.CallCore('', callback, 'html', 'GET', data, action, showLoading, errorcallback);
    };

    BAPS.Ajax.PostHTML = function (action, data, callback, errorcallback, showLoading) {
        BAPS.Ajax.CallCore('', callback, 'html', 'POST', data, action, showLoading, errorcallback);
    };

    BAPS.Ajax.PostHTMLUsingJson = function (action, data, callback, errorcallback, showLoading) {
        BAPS.Ajax.CallCore('', callback, 'html', 'POST', data, action, showLoading, errorcallback, null, true);
    };

    BAPS.Ajax.Post = function (action, data, callback, errorcallback, showLoading) {
        BAPS.Ajax.CallCore('', callback, 'text', 'POST', data, action, showLoading, errorcallback);
    };

    //-----------------------------------------------------------------------------------
    //   Core ajax call function
    //-----------------------------------------------------------------------------------
    BAPS.Ajax.CallCore = function (querystring, callback, dataType, type, data, url, showLoading, errorcallback, doNotHideLoading, sendAsJsonContentType) {
        if (showLoading === null) {
            showLoading = true;
        }
        if (doNotHideLoading === null) {
            doNotHideLoading = false;
        }

        if (showLoading) {
            // Show Ajax Div
            BAPS.Ajax.showSpinner();
        }

        if (type === null) {
            type = 'GET';
        }

        var headers = {};

        if (type === 'POST') {
            data = data || {};

            if (data.__RequestVerificationToken === undefined) {
                BAPS.console.log('No CRSF in data.');

                var globalCRSFTokenInput = $('input[name="__RequestVerificationToken"]')[0];

                if (globalCRSFTokenInput === undefined) {
                    BAPS.console.log('No global CRSF token found.');
                }
                else {
                    headers['__RequestVerificationToken'] = globalCRSFTokenInput.value;
                }
            }
            else {
                headers['__RequestVerificationToken'] = data.__RequestVerificationToken;
                delete data.__RequestVerificationToken;
            }
        }
        BAPS.console.log(headers);
        if (url === null) {
            url = AjaxServerPageName;
        }

        if (querystring === null) {
            querystring = '';
        }

        if (BAPS.Debug && data !== null) {
            BAPS.console.log(data);
        }

        var contentType;

        if (sendAsJsonContentType) {
            contentType = 'application/json; charset=utf-8';
            data = JSON.stringify(data);
        }

        $.ajax({
            url: '/' + BAPS.Ajax.getCulturePath() + url + querystring,
            type: type,
            dataType: dataType,
            data: data,
            contentType: contentType,
            headers: headers,
            cache: false,
            success: function (resultData) {
                // Hide Ajax Div
                if (showLoading && !doNotHideLoading) {
                    BAPS.Ajax.hideSpinner();
                }

                if (BAPS.Debug && BAPS.DebugLogResponse) {
                    BAPS.console.log(resultData);
                }

                //if (dataType === 'html' && typeof $.parseJSON(resultData) == 'object') {

                //    try {

                //    }

                //    JSON.parse
                //    // json error returned!
                //    if (errorcallback != undefined) {
                //        errorcallback($.parseJSON(resultData));
                //    }
                //}
                //else
                if (callback !== undefined) {
                    callback(resultData);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401 || jqXHR.status === 278) {
                    BAPS.Ajax.redirectForAuthentication(jqXHR);
                }
                else {
                    if (BAPS.Debug) {
                        BAPS.console.log(errorThrown);
                    }

                    if (errorcallback !== undefined && errorcallback !== null) {
                        errorcallback(errorThrown, jqXHR);
                    }
                    else {
                        BAPS.Ajax.defaultErrorHandler(errorThrown);
                    }

                    // Hide Ajax Div
                    BAPS.Ajax.hideSpinner();

                    //ShowError(result);
                }

            }
        });
    };

    BAPS.Ajax.getCulturePath = function () {
        var htmlCult = $('html').attr('data-language');
        if (htmlCult !== undefined) {
            if (htmlCult.length > 0) {
                return htmlCult;
            }
            else {
                return window.location.pathname.split('/')[1];
            }
        }
        else {
            return window.location.pathname.split('/')[1];
        }
    };

    BAPS.Ajax.redirectForAuthentication = function (jqXHR) {
        if (jqXHR.status === 401) {
            document.location.href = jqXHR.responseText + '?ReturnUrl=' + encodeURIComponent(document.location.pathname);
        }
        else if (jqXHR.status === 278) {
            document.location.href = jqXHR.responseText;
        }
    };

    // Used when a normally Html action returns a detail error as json instead of a normal Html response.
    BAPS.Ajax.JsonErrorFromHtmlAction = function (errorThrown, jqXHR) {
        var jsonResult = JSON.parse(jqXHR.responseText);

        BAPS.Core.ErrorAlert(jsonResult.ErrorMessage);
    };

    BAPS.Ajax.showSpinner = function () {
        if (BAPS.elementExists('.loader')) {
            $('.loader').addClass('is-loading');
        }
    };

    BAPS.Ajax.hideSpinner = function () {
        if (BAPS.elementExists('.loader')) {
            $('.loader').removeClass('is-loading');
        }
    };

    BAPS.Ajax.defaultErrorHandler = function (errorThrown) {
        //BAPS.Core.CloseModal();
        BAPS.Core.ErrorAlert(errorThrown);
    };

    // Handles a JsonRedirectResponseModel response
    BAPS.Ajax.defaultRedirectOrErrorHandler = function (resultData) {
        if (resultData.Success) {
            document.location.href = resultData.ReturnUrl;
        }
        else {
            BAPS.Core.ErrorAlert(resultData.ErrorMessage);
        }
    };
};