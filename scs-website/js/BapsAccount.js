BAPSObject.prototype.accountInit = function ($) {
    // Shortcut out if not required.
    //if (!this.elementExists('')) {
    //    return;
    //}
    //BAPS = this;
    BAPS.Account = {};

    $(document).ready(function () {
        BAPS.AttachAccount();
    });

    BAPS.AttachAccount = function () {
        $(".register__form").on("change", "input[name='Contact.Email']", BAPS.ListedEmailDomain);
        $(".self-register__form").on("change", "input[name='Contact.Email']", BAPS.ListedEmailDomain);
        $(".self-register__form").on("submit", BAPS.SelfRegister);
        $(".replace-tel-plus").on("change", "input.telephone-number", BAPS.ReplacePlusWithZero);
        //$('#changeEmail').on('click', function () { });
        $('#btnContextLogout').on('click', BAPS.Logout);
    };

    function BAPSLoginResponseObject(Success, ReturnUrl, PasswordExpired, ErrorMessage) {
        this.Success = Success;
        this.PasswordExpired = PasswordExpired;
        this.ReturnUrl = ReturnUrl;
        this.ErrorMessage = ErrorMessage;
    }

    function BAPSRegisterResponseObject(Success, ReturnUrl, ErrorMessage, UserName, Password) {
        this.Success = Success;
        this.ReturnUrl = ReturnUrl;
        this.ErrorMessage = ErrorMessage;
        this.LoginModel = {
            ReturnUrl: ReturnUrl,
            UserName: UserName,
            Password: Password
        };
    }
    
    function BAPSResetPasswordResponseObject(Success, ReturnUrl) {
        this.Success = Success;
        this.ReturnUrl = ReturnUrl;
    }

    function BAPSResetPasswordUpdateResponseObject(Success, ReturnUrl, ErrorMessage) {
        this.Success = Success;
        this.ReturnUrl = ReturnUrl;
        this.ErrorMessage = ErrorMessage;
    }

    function BAPSLogoutResponseObject(Success, ReturnUrl) {
        this.Success = Success;
        this.ReturnUrl = ReturnUrl;
    }

    BAPS.Login = function (loginModel, callback) {
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.Login,
            loginModel,
            function (data) {
                if (data.Success) {
                    callback(new BAPSLoginResponseObject(true, data.ReturnUrl, false, ""));
                }
                else {
                    callback(new BAPSLoginResponseObject(false, "", data.PasswordExpired, data.ErrorMessage));
                }
            },
            function (errorThrown) {
                callback(new BAPSLoginResponseObject(false, "", false, ""));
            }
        );
    };

    BAPS.Logout = function (callback) {
        document.location.href = '/' + BAPS.Ajax.getCulturePath() + BAPS.Routes.Logout;
        //BAPS.Ajax.PostFormGetJson(
        //    BAPS.Routes.Logout,
        //    null,
        //    function (data) {
        //        callback(new BAPSLogoutResponseObject(true, data.ReturnUrl));
        //    },
        //    function (errorThrown) {
        //        callback(new BAPSLogoutResponseObject(false,''));
        //    }
        //);
    };

    BAPS.ResetPassword = function (resetPasswordModel, callback) {
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.ResetPassword,
            resetPasswordModel,
            function (data) {
                callback(new BAPSResetPasswordResponseObject(true, data.ReturnUrl));
            },
            function (errorThrown) {
                callback(new BAPSResetPasswordResponseObject(false, ""));
            }
        );
    };

    BAPS.ResetPasswordUpdate = function (resetPasswordUpdateModel, callback) {
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.ResetPasswordUpdate,
            resetPasswordUpdateModel,
            function (data) {
                if (data.Success) {
                    callback(new BAPSResetPasswordUpdateResponseObject(true, data.ReturnUrl, ""));
                }
                else {
                    callback(new BAPSResetPasswordUpdateResponseObject(false, "", data.ErrorMessage));
                }
            },
            function (errorThrown, jqXHR) {
                callback(new BAPSResetPasswordUpdateResponseObject(false, "", jqXHR.responseJSON.errorMessageList[0].errorMessage));
            }
        );
    };

    BAPS.ListedEmailDomain = function (event) {
        event.preventDefault();
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.ListedEmailDomain,
            { Email: $(this).val() },
            function (resultData) {
                if (resultData.DomainListed) {
                    BAPS.Core.SuccessAlert($("#managerFieldsMessage").val());
                    $(".manager input").prop("disabled", false);
                    $(".manager").show('slow');
                }
                else {
                    $(".manager input").prop("disabled", true);
                    $(".manager").hide('slow');
                    $(".manager input").val("");

                }

            }
        );
    };

    BAPS.ReplacePlusWithZero = function (event) {
        BAPS.ReplacePlusWithZeroInner($(this));
    }

    BAPS.ReplacePlusWithZeroInner = function (ctrl) {
        BAPS.console.log(ctrl);
        if (ctrl.val().includes("+") > 0) {
            BAPS.console.log('Replacing + with 00');
            ctrl.val(ctrl.val().replace("++", "+"));
            ctrl.val(ctrl.val().replace("+++", "+"));
            ctrl.val(ctrl.val().replace("+", "00"));
        }
    }

    BAPS.Register = function (registerModel, callback) {
        // twiddle the data
        var primaryAddressCountryCodeName = "";
        var alternativeAddressCountryCodeName = "";
        $(registerModel).each(function (i, field) {
            if (field.name === "primaryAddressCountryCodeName") {
                primaryAddressCountryCodeName = field.value;
                //delete (registerModel, i);
            }
            if (field.name === "alternativeAddressCountryCodeName") {
                alternativeAddressCountryCodeName = field.value;
                //delete (registerModel, i);
            }
        });
        if (primaryAddressCountryCodeName !== "") {
            registerModel[registerModel.length] = { name: "Contact.PrimaryAddress.CountryCode", value: primaryAddressCountryCodeName.split("|")[0] };
            registerModel[registerModel.length] = { name: "Contact.PrimaryAddress.Country", value: primaryAddressCountryCodeName.split("|")[1] };
        }
        if (alternativeAddressCountryCodeName !== "") {
            registerModel[registerModel.length] = { name: "Contact.AlternativeAddress.CountryCode", value: alternativeAddressCountryCodeName.split("|")[0] };
            registerModel[registerModel.length] = { name: "Contact.AlternativeAddress.Country", value: alternativeAddressCountryCodeName.split("|")[1] };
        }

        $(registerModel).each(function (i, field) {
            BAPS.console.log(field.name + ": " + field.value);
        });

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.Register,
            registerModel,
            function (data) {
                if (data.Success) {
                    var UserName = "";
                    var Password = "";
                    $(registerModel).each(function (i, field) {
                        if (field.name === "Contact.Email") {
                            UserName = field.value;
                        }
                        if (field.name === "Contact.Password") {
                            Password = field.value;
                        }
                    });
                    //callback(new BAPSRegisterResponseObject(true, data.RedirectURL, "", UserName, Password));
                    document.location.href = data.RedirectURL;
                }
                else {
                    callback(new BAPSRegisterResponseObject(false, "", data.ErrorMessage, "", ""));
                }
            },
            function (errorThrown, jqXHR) {
                callback(new BAPSRegisterResponseObject(false, "", errorThrown, "", ""));
            }
        );
    };


    BAPS.SelfRegister = function (event) {
        event.preventDefault();

        var errMsg = $('.register__errors');

        if (BAPS.Core.ValidateForm(event.target)) {
            errMsg.hide();
            var registerModel = $(this).serializeArray();

            $(registerModel).each(function (i, field) {
                BAPS.console.log(field.name + ": " + field.value);
            });

            BAPS.Ajax.PostFormGetJson(
                BAPS.Routes.SelfRegister,
                registerModel,
                function (data) {
                    if (data.Success) {
                        //var UserName = "";
                        //var Password = "";
                        //$(registerModel).each(function (i, field) {
                        //    if (field.name === "Contact.Email") {
                        //        UserName = field.value;
                        //    }
                        //    if (field.name === "Contact.Password") {
                        //        Password = field.value;
                        //    }
                        //});
                        //callback(new BAPSRegisterResponseObject(true, data.RedirectURL, "", UserName, Password));
                        document.location.href = data.RedirectURL;
                    }
                    else {
                        errMsg.find('.register__serverErrorText').text(data.ErrorMessage), errMsg.show(), t('html, body').animate({
                            scrollTop: errMsg.offset().top - 50
                        }, 500);
                        //callback(new BAPSRegisterResponseObject(false, "", data.ErrorMessage, "", ""));
                    }
                },
                function (errorThrown, jqXHR) {
                    errMsg.find('.register__serverErrorText').text(errorThrown), errMsg.show(), t('html, body').animate({
                        scrollTop: errMsg.offset().top - 50
                    }, 500);
                    //callback(new BAPSRegisterResponseObject(false, "", errorThrown, "", ""));
                }
            );
        }
        
    };
};
