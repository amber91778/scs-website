BAPSObject.prototype.iConnectInit = function ($) {
    // bail out if there's no iConnect menu
    if (!BAPS.elementExists('.account-nav')) {
        return;
    }

    BAPS.iConnect = {};

    BAPS.iConnect.reportsContainer = '.iConnectReports';
    BAPS.iConnect.reportsModelContainer = 'body';
    BAPS.iConnect.rolesContainer = '.iConnectRoles';   
    BAPS.iConnect.iConnectApproval = '.iConnectApproval';
    BAPS.iConnect.myApprovalAndApprovalDelegation = '.iConnectMyApprovalAndApprovalDelegation';
    BAPS.iConnect.myApprovalAndApprovalDelegationContainer = 'body';
    BAPS.iConnect.approvalModelContainer = 'body';
    BAPS.iConnect.bookingDetailContainer = '.iConnectBookingDetail';

    BAPS.iConnect.DataKeys = {
        ID: 'id',
        Name: 'name',
        addTranslation: 'addtranslation',
        delegateSuccessTranslation: 'delegatesuccesstranslation',
        approvalSuccessTranslation: 'approvalsuccesstranslation',
        Type: 'type',
        FileName: 'filename',
        Error: 'error',
        PrepaymentIDEQS: 'prepaymentideqs',
        ContactIDEQS: 'contactideqs',
        BookingIDEQS: 'bookingideqs',
        MasterBookingIDEQS: 'masterbookingideqs',
        LineNumberEQS: 'linenumbereqs',
        DelegateIDEQS: 'delegateideqs',
        ContactName: 'contactname',
        Sender: 'sender',
        BaseURL: 'baseurl'
    };

    $(document).ready(function () {
        BAPS.iConnect.AttachBookingDetail();
        BAPS.iConnect.AttachMyCourses();
        BAPS.iConnect.AttachPurchaseHistory();
        BAPS.iConnect.AttachMyApprovals();
        BAPS.iConnect.AttachDepartments();
        BAPS.iConnect.AttachRoles();
        BAPS.iConnect.AttachReports();
        BAPS.iConnect.AttachApprovals();
        BAPS.iConnect.AttachApprovalDelegation();
        BAPS.iConnect.AttachAddUser();
        BAPS.iConnect.AttachEditUser();

        $('body').on('click', '.bookings__back', function (event) {
            if (window.history.length > 1 && !BAPS.elementExists('.bookings .bookings-complete')) {
                event.preventDefault();
                window.history.back();
            }
        });   
    });

    BAPS.iConnect.AttachBookingDetail = function () {
        $('body').on('submit', '.cancel-booking__form', BAPS.iConnect.cancelBooking);

        $('body').on('submit', '.select-prepay__form', BAPS.iConnect.changePaymentPrepayment);
        $('body').on('submit', '.select-package__form', BAPS.iConnect.changePaymentPackage);

        $('body').on('submit', '.change-name__search-form', BAPS.iConnect.changeNameSearch);
        $('body').on('submit', '.change-name__form', BAPS.iConnect.changeName);

        $('body').on('click', '.bookings__approve', BAPS.iConnect.approveBooking);

        BAPS.iConnect.RebindBookingDetail();
    }

    BAPS.iConnect.RebindBookingDetail = function () {
        $(BAPS.iConnect.bookingDetailContainer).on('submit', '.booking-note__form', BAPS.iConnect.bookingDetailNoteSave);

        $('.booking-payment__select-prepay').off('click');
        $('.booking-payment__select-package').off('click');

        $(BAPS.iConnect.bookingDetailContainer).on('click', '.booking-payment__select-prepay', BAPS.iConnect.loadPrepayments);
        $(BAPS.iConnect.bookingDetailContainer).on('click', '.booking-payment__select-package', BAPS.iConnect.loadPackages);

        $(BAPS.iConnect.bookingDetailContainer).on('submit', '.booking-payment__order-form', BAPS.iConnect.changePaymentInvoice);
        $(BAPS.iConnect.bookingDetailContainer).on('click', '.booking-payment__card-submit', BAPS.iConnect.changePaymentCard);

        $('.bookings__assign').magnificPopup({
            items: {
                src: '.change-name-modal',
                type: 'inline'
            },
            mainClass: 'change-name-wrapper'
        });
        $(BAPS.iConnect.bookingDetailContainer).on('click', '.bookings__assign', BAPS.iConnect.setupChangeName);
        $(BAPS.iConnect.bookingDetailContainer).on('click', '.bookings__change-name', BAPS.iConnect.setupChangeName);
    }

    BAPS.iConnect.AttachMyCourses = function () {
        $('.iConnectMyCourses .acct-course--1').on('click', '.paginate button', BAPS.iConnect.getMyCoursesElearningList);
        $('.iConnectMyCourses .acct-course--2').on('click', '.paginate button', BAPS.iConnect.getMyCoursesCourseBookingList);
        $('.iConnectMyCourses .acct-course__filters').on('submit', function (event) {
            BAPS.iConnect.getMyCoursesCourseBookingList(event, 1);
        });
        $('.iConnectMyCourses .acct-course__filters__eLearning').on('submit', function (event) {
            BAPS.iConnect.getMyCoursesElearningList(event, 1);
        });

        $('.acct-course--1').on('change', '#SortBy', function (event) {
            BAPS.iConnect.getMyCoursesElearningList(event, 1);
        });

        $('.iConnectMyCourses').on('click', '.acct-course__launch.external', BAPS.iConnect.showExternalLaunchMessage);

        $('.iConnectMyCourses').on('click', '.acct-course__launch.cpll', BAPS.iConnect.showCPLLLaunchMessage);

        $('.iConnectMyCourses').on('click', '.acct-course__launch:not(.external, .cpll)', BAPS.iConnect.showLaunchMessage);
    };

    BAPS.iConnect.AttachPurchaseHistory = function () {
        $('.iConnectPurchaseHistory .acct-course--1').on('click', '.paginate button', BAPS.iConnect.getPurchaseHistoryElearningList);
        $('.iConnectPurchaseHistory .acct-course--2').on('click', '.paginate button', BAPS.iConnect.getPurchaseHistoryCourseBookingList);
        $('.iConnectPurchaseHistory .acct-course--3').on('click', '.paginate button', BAPS.iConnect.getPurchaseHistoryOrderList);

        $('.iConnectPurchaseHistory .acct-course__filters_eh').on('submit', function (event) {
            BAPS.iConnect.getPurchaseHistoryElearningList(event, 1);
        });

        $('.iConnectPurchaseHistory .acct-course__filters_bh').on('submit', function (event) {
            BAPS.iConnect.getPurchaseHistoryCourseBookingList(event, 1);
        });

        $('.iConnectPurchaseHistory .acct-course__filters_oh').on('submit', function (event) {
            BAPS.iConnect.getPurchaseHistoryOrderList(event, 1);
        });       
    };

    BAPS.iConnect.AttachMyApprovals = function () {
        $('.iConnectMyApprovals').on('click', '.paginate button', BAPS.iConnect.getMyApprovalsBookingList);
    };

    BAPS.iConnect.AttachDepartments = function () {
        $('.iConnectDepartments .departments__field-dropdown').on('change', BAPS.iConnect.getDepartment);
        $('.iConnectDepartments').on('click', '.removeMember', BAPS.iConnect.removeDepartmentMember);
        $('.iConnectDepartmentAdd .department__form').on('submit', BAPS.iConnect.addDepartment);
        $('.iConnectDepartmentEdit .department__form').on('submit', BAPS.iConnect.editDepartment);
        $('.iConnectDepartmentMemberAdd').on('submit', '.dept-emp__search-form', BAPS.iConnect.getDepartmentPotentialMembers);
        $('.iConnectDepartmentMemberAdd').on('submit', '.dept-emp__form', BAPS.iConnect.addDepartmentMembers);
    };

    BAPS.iConnect.AttachAddUser = function () {
        $(".iConnectContactAdd").on("submit", "form.contactAdd__form", BAPS.iConnect.addUser);
        $('.iConnectContactAdd').on('click','[name="Contact.Shadow"]', BAPS.iConnect.showHideAltAddressHandler);
        // set default state
        BAPS.iConnect.showHideAltAddressLoad($('[name="Contact.Shadow"]'));
    };

    BAPS.iConnect.AttachEditUser = function () {
        $('#changeEmail').magnificPopup({
            items: {
                src: '#change-email-modal',
                type: 'inline'
            },
            mainClass: 'add-modal-outer'
        });

        $('#changePassword').magnificPopup({
            items: {
                src: '#change-password-modal',
                type: 'inline'
            },
            mainClass: 'add-modal-outer'
        });
        
        $(".iConnectContactEdit").on("submit", "form.contactEdit__form", BAPS.iConnect.editUser);

        $('.iConnectContactEdit').on('click', '[name="Contact.Shadow"]', BAPS.iConnect.showHideAltAddressHandler);
        // set default state
        BAPS.iConnect.showHideAltAddressLoad($('[name="Contact.Shadow"]'));
        
        $("#change-email-modal").on("submit", "form.changeEmail-modal__form", BAPS.iConnect.changeEmail);
        $("#change-password-modal").on("submit", "form.changePassword-modal__form", BAPS.iConnect.changePassword);
    };

    
    BAPS.iConnect.showHideAltAddressHandler = function () {
        if ($(this).is(':checked')) {
            $('[id^="Contact.AlternativeAddress."] input').prop('disabled', false);
            $('[id^="Contact.AlternativeAddress."]').parent().show('slow');
        }
        else {
            $('[id^="Contact.AlternativeAddress."] input').prop('disabled', true);
            $('[id^="Contact.AlternativeAddress."]').parent().hide('slow'); 
        }
    };

    BAPS.iConnect.showHideAltAddressLoad = function (control) {
        if (!control.is(':checked')) {
            $('[id^="Contact.AlternativeAddress."] input').prop('disabled', true);
            $('[id^="Contact.AlternativeAddress."]').parent().hide('slow'); 
        }
    };

    BAPS.iConnect.AttachRoles = function () {
        if (!BAPS.elementExists(BAPS.iConnect.rolesContainer)) {
            return;
        }

        $(BAPS.iConnect.rolesContainer + ' .roles__field-dropdown').on('change', BAPS.iConnect.getRoleRules);
        $(BAPS.iConnect.rolesContainer).on('submit', 'form.role-perms__form', BAPS.iConnect.saveRoleRules);
        $(BAPS.iConnect.rolesContainer + ' .role__form').on('submit', BAPS.iConnect.addEditRole);
    };

    BAPS.iConnect.AttachReports = function () {
        if (!BAPS.elementExists(BAPS.iConnect.reportsContainer)) {
            return;
        }

        $(BAPS.iConnect.reportsContainer).on('submit', 'form.baps-reports', BAPS.iConnect.loadReport);

        $(BAPS.iConnect.reportsContainer).on('click', '.history__export', BAPS.iConnect.reportToExcel);

        //$(BAPS.iConnect.reportsContainer).on('click', 'a.history-filters__change', BAPS.iConnect.reportToExcel);
        $(BAPS.iConnect.reportsContainer + ' a.history-filters__change').magnificPopup({
            items: {
                src: '#user-search',
                type: 'inline'
            },
            mainClass: 'add-modal-outer'
        });

        $(BAPS.iConnect.reportsModelContainer).on('submit', 'form.usersearch-modal__form', BAPS.iConnect.searchForReportUser);

        $(BAPS.iConnect.reportsModelContainer).on('click', 'a.add-modal__trigger', BAPS.iConnect.selectReportUser);
    };

    BAPS.iConnect.AttachApprovals = function () {
        if (!BAPS.elementExists(BAPS.iConnect.iConnectApproval)) {
            return;
        }

        $(BAPS.iConnect.iConnectApproval + ' .sign-off__dept .sign-off__select').on('change', BAPS.iConnect.approvalsDeptChange);

        $(BAPS.iConnect.iConnectApproval + ' #addLevelBlock .sign-off__select').on('change', BAPS.iConnect.enableDisableAddLevelButton);

        $(BAPS.iConnect.iConnectApproval).on('click', '.approval-levels__remove', BAPS.iConnect.removeApprovalLevel);

        $(BAPS.iConnect.iConnectApproval).on('click', '.approval-levels__add', BAPS.iConnect.launchAddApprovalUser);

        $(BAPS.iConnect.iConnectApproval).on('click', '.approval-levels__trigger', BAPS.iConnect.removeApprovalUser);

        $(BAPS.iConnect.iConnectApproval).on('submit', 'form.sign-off__add-form', BAPS.iConnect.addApprovalLevel);

        $(BAPS.iConnect.approvalModelContainer).on('submit', 'form.add-modal__form', BAPS.iConnect.searchForApprovalUser);

        $(BAPS.iConnect.approvalModelContainer).on('click', 'a.add-modal__trigger', BAPS.iConnect.addApprovalUser);
    };

    BAPS.iConnect.AttachApprovalDelegation = function () {
        if (!BAPS.elementExists(BAPS.iConnect.myApprovalAndApprovalDelegation)) {
            return;
        }

        $(BAPS.iConnect.myApprovalAndApprovalDelegation + ' .sign-off__add-delegate').magnificPopup({
            items: {
                src: '#user-search',
                type: 'inline'
            },
            mainClass: 'add-modal-outer'
        });

        $(BAPS.iConnect.myApprovalAndApprovalDelegationContainer).on('submit', 'form.add-modal__form', BAPS.iConnect.searchForApprovalUser);

        $(BAPS.iConnect.myApprovalAndApprovalDelegationContainer).on('click', 'a.add-modal__trigger', BAPS.iConnect.addApprovalDelegateUser);

        $(BAPS.iConnect.myApprovalAndApprovalDelegation).on('click', 'a.delegation-remove', BAPS.iConnect.removeApprovalDelegateUser);
        
    };
    
    BAPS.iConnect.bookingDetailNoteSave = function (event) {
        var form = $(this);
        var data = form.serializeObject();
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.iConnectBookingDetailNotesSave,
            data,
            function (resultData) {
                if (resultData.Success) {
                    $('.booking-note__text').text(data.Notes);
                    $('.booking-note__add').hide();
                    $('.booking-note__edit').show();
                    form.find('.booking-note__cancel').trigger('click');
                    $('.booking-note').addClass('has-note');
                }
                else {
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            }
        );
        event.preventDefault();
    };

    BAPS.iConnect.cancelBooking = function (event) {
        event.preventDefault();
        var data = $(this).serializeObject();
        BAPS.Ajax.GetJson(
            BAPS.Routes.iConnectCancelBooking,
            data,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.iConnect.ReloadBooking();
                }
                else {
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            }
        );

    };

    BAPS.iConnect.loadPrepayments = function (event) {
        var btn = $(this);
        var data = {
            BookingIDEQS: btn.data(BAPS.iConnect.DataKeys.BookingIDEQS),
            PrePaymentIDEQS: btn.data(BAPS.iConnect.DataKeys.PrepaymentIDEQS)
        };
        console.log(data);
        BAPS.Ajax.GetHTML(BAPS.Routes.iConnectPrepayments,
            data,
            function (resultData) {
                $('.select-prepay-modal').replaceWith(resultData);
                BAPS.Core.OpenModal('.select-prepay-modal', 'select-prepay-wrapper');
            });
    };

    BAPS.iConnect.loadPackages = function (event) {
        var btn = $(this);
        var data = {
            BookingIDEQS: btn.data(BAPS.iConnect.DataKeys.BookingIDEQS),
            PrePaymentIDEQS: btn.data(BAPS.iConnect.DataKeys.PrepaymentIDEQS)
        };

        BAPS.Ajax.GetHTML(BAPS.Routes.iConnectPackages,
            data,
            function (resultData) {
                $('.select-package-modal').replaceWith(resultData);
                BAPS.Core.OpenModal('.select-package-modal', 'select-package-wrapper');
            });
    };

    BAPS.iConnect.changePaymentPackage = function (event) {
        event.preventDefault();
        var form = $(this);
        var data = form.serializeObject()

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.iConnectSetPayPackage,
            data,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.iConnect.ReloadBooking();
                }
                else {
                    BAPS.Core.CloseModal();
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            });
    };

    BAPS.iConnect.changePaymentPrepayment = function (event) {
        event.preventDefault();
        var form = $(this);
        var data = form.serializeObject();

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.iConnectSetPaySkillsLicense,
            data,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.iConnect.ReloadBooking();
                }
                else {
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            });
    };

    BAPS.iConnect.changePaymentInvoice = function (event) {
        event.preventDefault();
        var form = $(this);
        var data = form.serializeObject();

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.iConnectSetPayInvoice,
            data,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.iConnect.ReloadBooking();
                }
                else {
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            });
    };

    BAPS.iConnect.changePaymentCard = function (event) {
        event.preventDefault();

        var btn = $(this);
        var data = {
            BookingIDEQS: btn.data(BAPS.iConnect.DataKeys.BookingIDEQS)
        };

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.iConnectSetPayCard,
            data,
            function (resultData) {
                if (resultData.Success) {
                    if (resultData.RedirectType) {
                        window.location.replace(resultData.RedirectUrl);
                    }
                    else if (resultData.SubmissionType) {
                        var form = $(resultData.SubmissionForm);
                        form.insertAfter(btn);
                        form.submit();
                    }
                }
                else {
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            });
    };

    BAPS.iConnect.setupChangeName = function (event) {
        event.preventDefault();

        var btn = $(this);
        var nameChangeForm = $('form.change-name__form');

        var BookingIDEQS = btn.data(BAPS.iConnect.DataKeys.BookingIDEQS);
        var MasterBookingIDEQS = btn.data(BAPS.iConnect.DataKeys.MasterBookingIDEQS);
        var LineNumberEQS = btn.data(BAPS.iConnect.DataKeys.LineNumberEQS);
        var DelegateIDEQS = btn.data(BAPS.iConnect.DataKeys.DelegateIDEQS);

        if (LineNumberEQS === undefined) {
            LineNumberEQS = "";
        }
        if (DelegateIDEQS === undefined) {
            DelegateIDEQS = "";
        }

        nameChangeForm.children('[name="BookingIDEQS"]').val(BookingIDEQS);
        nameChangeForm.children('[name="LineNumberEQS"]').val(LineNumberEQS);
        nameChangeForm.children('[name="OldDelegateIDEQS"]').val(DelegateIDEQS);
        nameChangeForm.data(BAPS.iConnect.DataKeys.Sender, btn);

        var url = '?BookingIDEQS=' + BookingIDEQS;

        if (MasterBookingIDEQS != undefined) {
            url = url + '&MasterBookingIDEQS=' + MasterBookingIDEQS;
        }

        url = url + '&LineNumberEQS=' + LineNumberEQS + '&OldDelegateIDEQS=' + DelegateIDEQS;

        var addBut = $('a.change-name__add-delegate');
        addBut.attr('href', addBut.data(BAPS.iConnect.DataKeys.BaseURL) + url);
    };

    BAPS.iConnect.changeNameSearch = function (event) {
        event.preventDefault();

        var data = $(this).serializeObject();

        BAPS.Ajax.PostHTML(BAPS.Routes.iConnectNameChangeUserSearch,
            data,
            function (resultData) {
                $('.change-name__table').replaceWith(resultData);
                BAPS.Core.ReattachCheckboxes();
            });
    };

    BAPS.iConnect.changeName = function (event) {
        event.preventDefault();
        var form = $(this);
        var data = form.serializeObject();

        var route = BAPS.Routes.iConnectNameChangeElearning;

        if (data.LineNumberEQS === "") {
            route = BAPS.Routes.iConnectNameChange;
        }

        var name = form.find(':checked').first().data(BAPS.iConnect.DataKeys.ContactName);

        BAPS.Ajax.PostFormGetJson(route,
            data,
            function (resultData) {
                if (resultData.Success) {
                    if (data.LineNumberEQS === "") {
                        // main name change -> reload booking

                        BAPS.iConnect.ReloadBooking(BAPS.iConnect.ShowDelegateChangeSuccessMessage);
                    }
                    else {
                        // elearning name change, change name in table
                        var a = form.data(BAPS.iConnect.DataKeys.Sender);
                        a.parents('tr').children('.del-name').text(name);
                        a.data(BAPS.iConnect.DataKeys.DelegateIDEQS, data.ContactIDEQS);

                        BAPS.Core.CloseModal();

                        $('.change-name__table').children().remove();

                        BAPS.iConnect.ShowDelegateChangeSuccessMessage();
                    }
                }
                else {
                    BAPS.Core.CloseModal();
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            });
    };

    BAPS.iConnect.ShowDelegateChangeSuccessMessage = function () {
        BAPS.Core.SuccessAlert($(".iConnectBookingDetail").data(BAPS.iConnect.DataKeys.delegateSuccessTranslation));
    };

    BAPS.iConnect.approveBooking = function (event) {
        event.preventDefault();

        var data = { ApproveBookingIDEQS: $(this).data(BAPS.iConnect.DataKeys.BookingIDEQS) };

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.iConnectBookingApprove,
            data,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.iConnect.ReloadBooking(BAPS.iConnect.ShowApprovalSuccessMessage);
                }
                else {
                    BAPS.Core.CloseModal();
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            });
    };

    BAPS.iConnect.ShowApprovalSuccessMessage = function () {
        BAPS.Core.SuccessAlert($(".iConnectBookingDetail").data(BAPS.iConnect.DataKeys.approvalSuccessTranslation));
    };

    BAPS.iConnect.ReloadBooking = function (callback) {
        BAPS.Core.CloseModal();

        BAPS.Ajax.GetHTML(
            BAPS.Routes.iConnectBookingDetail,
            { BookingIDEQS: $(".iConnectBookingDetail").data(BAPS.iConnect.DataKeys.BookingIDEQS) },
            function (resultData) {
                $(".iConnectBookingDetail").replaceWith(resultData);

                //rebind
                BAPS.iConnect.RebindBookingDetail();
                //rebind verndale
                $('.bookings').booking();

                if (callback) {
                    callback();
                }
            },
            null
        );
    };

    BAPS.iConnect.addUser = function (event) {
        event.preventDefault();

        $('.telephone-number').each(function () { BAPS.ReplacePlusWithZeroInner($(this)); });

        $("input[name='Contact.LoginName']").val($("input[name='Contact.Email']").val());

        if (BAPS.Core.ValidateForm(event.target)) {
            BAPS.Ajax.PostFormGetJson(
                BAPS.Routes.iConnectContactAdd,
                $(this).serializeObject(),
                BAPS.Ajax.defaultRedirectOrErrorHandler
            );
        }
    };

    BAPS.iConnect.editUser = function (event) {
        event.preventDefault();

        $('.telephone-number').each(function () { BAPS.ReplacePlusWithZeroInner($(this)); });

        var data = $(this).serializeObject();
        var route = BAPS.Routes.iConnectContactEdit;

        if (data["Contact.IsSelf"] === "true") {
            route = BAPS.Routes.iConnectAccountEdit;
        }

        if (BAPS.Core.ValidateForm(event.target)) {
            BAPS.Ajax.PostFormGetJson(
                route,
                data,
                BAPS.Ajax.defaultRedirectOrErrorHandler
            );
        }
    };


    BAPS.iConnect.changeEmail = function (event) {
        event.preventDefault();
        if (BAPS.Core.ValidateForm(event.target)) {
            var model = $(this).serializeObject();

            BAPS.Ajax.PostFormGetJson(
                BAPS.Routes.iConnectContactEditEmail,
                model,
                function (resultData) {
                    BAPS.Core.CloseModal();
                    if (resultData.Success) {
                        // update controls on page

                        // main form submitted
                        $('input:hidden[name="Contact.Email"]').val(model.UserName);

                        // disabled display
                        $('#ContactEmail').val(model.UserName);

                        // password update
                        $('#change-password-modal input:hidden[name="UserName"]').val(model.UserName);
                        BAPS.Core.SuccessAlert($(event.target).data('successmessage'));
                    }
                    else {
                        BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                    }
                }
            );
        }
    };

    BAPS.iConnect.changePassword = function (event) {
        event.preventDefault();
        if (BAPS.Core.ValidateForm(event.target)) {
            var model = $(this).serializeObject();

            BAPS.Ajax.PostFormGetJson(
                BAPS.Routes.iConnectContactEditPassword,
                model,
                function (resultData) {
                    BAPS.Core.CloseModal();
                    if (resultData.Success) {
                        BAPS.Core.SuccessAlert($(event.target).data('successmessage'));
                    }
                    else {
                        BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                    }
                }
            );
        }
    };

    BAPS.iConnect.getDepartment = function (event) {
        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectDepartment,
            { DepartmentIDEQS: $(this).val() },
            function (resultData) {
                $(".iConnectDepartments .dept-emps").html(resultData);
            },
            null
        );
    };

    BAPS.iConnect.addDepartment = function (event) {
        event.preventDefault();

        if (!BAPS.Core.ValidateForm(this, BAPS.iConnect.AddFormError, BAPS.iConnect.RemoveFormErrors)) {
            return false;
        }

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.iConnectDepartmentAdd,
            $(this).serializeObject(),
            function (resultData) {
                if (resultData.Success) {
                    document.location.href = resultData.ReturnUrl;
                }
                else {
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                } 
            }
        );
    };

    BAPS.iConnect.editDepartment = function (event) {
        event.preventDefault();

        if (!BAPS.Core.ValidateForm(this, BAPS.iConnect.AddFormError, BAPS.iConnect.RemoveFormErrors)) {
            return false;
        }

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.iConnectDepartmentEdit,
            $(this).serializeObject(),
            function (resultData) {
                if (resultData.Success) {
                    document.location.href = resultData.ReturnUrl;
                }
                else {
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            }
        );
    };

    BAPS.iConnect.getDepartmentPotentialMembers = function (event) {
        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectDepartmentPotentialMembers,
            $(this).serializeObject(),
            function (resultData) {
                // remove existing search results if any exist
                $(".iConnectDepartmentMemberAdd .dept-emp__no-results").remove();
                $(".iConnectDepartmentMemberAdd .dept-emp__form").remove();
                // insert the new html
                $(resultData).insertAfter(".iConnectDepartmentMemberAdd .dept-emp__search-form");
                BAPS.Core.ReattachCheckboxes();
            }
        );
        event.preventDefault();
    };

    BAPS.iConnect.addDepartmentMembers = function (event) {
        event.preventDefault();

        var data = $(this).serializeObject();

        if (Object.keys(data).length === 0) {
            BAPS.Core.ErrorAlert($("input[name='nothingSelectedErrorText']").val());
            return;
        }

        data.ReturnUrl = $("input[name='ReturnUrl']").val();
        data.DepartmentIDEQS = $("input[name='DepartmentIDEQS']").val();
        //data = BAPS.Core.DataObjectArrayToList(data, "Contacts.ContactNumberEQS");

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.iConnectDepartmentAddMembers,
            data,
            function (resultData) {
                if (resultData.Success) {
                    document.location.href = resultData.ReturnUrl;
                }
                else {
                    BAPS.Core.ErrorAlert($("input[name='couldNotAddErrorText']").val());
                }
            }
        );
    };

    BAPS.iConnect.removeDepartmentMember = function (event) {
        var data = {};
        data.Contact = {};
        data.Contact.ContactNumberEQS = $(this).attr("contactNumberEQS");
        data.Contact.DepartmentIDEQS = $(".departments__field-dropdown").val();
        // mark the victim for death
        $(this).closest("tr").addClass("killMe");

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.iConnectDepartmentRemoveMembers,
            data,
            function (resultData) {
                if (resultData.Success) {
                    // kill the victim
                    BAPS.Core.Remove($(".killMe"));
                    // update the count in the dropdown

                    // get the drop down element
                    var dropdownText = $("div.selectize-control div.item").text();
                    var dropDownTextArray = dropdownText.split("(");
                    var dropdownTextLeft = dropDownTextArray[0];
                    var dropdownCount = parseInt(dropDownTextArray[1].split(")")[0]);
                    dropdownCount = dropdownCount - 1;
                    var newDropdownText = dropdownTextLeft + "(" + dropdownCount + ")";
                    BAPS.console.log(newDropdownText);
                    $("div.option.active").text(newDropdownText);
                    $("div.selectize-control div.item").text(newDropdownText);
                }
                else {
                    BAPS.Core.ErrorAlert($("input[name='couldNotRemoveDelegate']").val());
                }
            }
        );

    };

    BAPS.iConnect.getMyCoursesElearningList = function (event, pageNo) {
        var form = $("form.acct-course__filters__eLearning");
        BAPS.Core.GetSetFormPageNo(event, form, pageNo);

        var data = form.serializeObject();

        if (data.ClassCode === "-1") {
            data.ClassCode = "";
        }

        if (data.TechType === "-1") {
            data.TechType = "";
        }

        var sorting = $("select#SortBy").val();
        data.SortDirection = sorting.split('-')[1];
        data.OrderBy = sorting.split('-')[0];


        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectMyCoursesELearning,
            data,
            function (resultData) {
                $(".acct-course--1").html(resultData);
                window.gktooltip($('.acct-course--1'));
                $("select#SortBy").filterDropdown();

                BAPS.State.searchComplete(form);
            },
            null
        );

        event.preventDefault();
    };

    BAPS.iConnect.getMyCoursesCourseBookingList = function (event, pageNo) {
        var form = $('form.acct-course__filters');
        BAPS.Core.GetSetFormPageNo(event, form, pageNo);

        var data = form.serializeObject();
        data.EventFromDate = data.Statedate_submit; // _submit fields hold the properly formatted date data - they are generated by VD's chosen datepicker. Copy the values across to the proper fields.
        data.EventToDate = data.Enddate_submit;

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectMyCoursesBookings,
            data,
            function (resultData) {
                $(".acct-course--2").html(resultData);
                window.gktooltip($('.acct-course--2'));

                BAPS.State.searchComplete(form);
            },
            null
        );

        event.preventDefault();
    };

    BAPS.iConnect.getPurchaseHistoryElearningList = function (event, pageNo) {
        var form = $('form.acct-course__filters_eh');
        BAPS.Core.GetSetFormPageNo(event, form, pageNo);

        var data = form.serializeObject();
        data.BookingFromDate = data.Statedate_submit; // _submit fields hold the properly formatted date data - they are generated by VD's chosen datepicker. Copy the values across to the proper fields.
        data.BookingToDate = data.Enddate_submit;

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectPurchaseHistoryELearning,
            data,
            function (resultData) {
                $(".acct-course--1").html(resultData);
                window.gktooltip($('.acct-course--1'));

                BAPS.State.searchComplete(form);
            },
            null
        );

        event.preventDefault();
    };

    BAPS.iConnect.getPurchaseHistoryCourseBookingList = function (event, pageNo) {
        var form = $('form.acct-course__filters_bh');
        BAPS.Core.GetSetFormPageNo(event, form, pageNo);

        var data = form.serializeObject();
        data.BookingFromDate = data.Statedate_submit; // _submit fields hold the properly formatted date data - they are generated by VD's chosen datepicker. Copy the values across to the proper fields.
        data.BookingToDate = data.Enddate_submit;

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectPurchaseHistoryBookings,
            data,
            function (resultData) {
                $(".acct-course--2").html(resultData);
                window.gktooltip($('.acct-course--2'));

                BAPS.State.searchComplete(form);
            },
            null
        );

        event.preventDefault();
    };

    BAPS.iConnect.getPurchaseHistoryOrderList = function (event, pageNo) {
        var form = $('form.acct-course__filters_oh');
        BAPS.Core.GetSetFormPageNo(event, form, pageNo);

        var data = form.serializeObject();
        data.BookingFromDate = data.Statedate_submit; // _submit fields hold the properly formatted date data - they are generated by VD's chosen datepicker. Copy the values across to the proper fields.
        data.BookingToDate = data.Enddate_submit;

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectPurchaseHistoryOrders,
            data,
            function (resultData) {
                $(".acct-course--3").html(resultData);
                window.gktooltip($('.acct-course--3'));

                BAPS.State.searchComplete(form);
            },
            null
        );

        event.preventDefault();
    };

    BAPS.iConnect.getMyApprovalsBookingList = function (event, pageNo) {
        if (pageNo === null || typeof pageNo === "undefined") {
            pageNo = BAPS.Core.GetPageNo(event);
        }

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectMyApprovalsBookings,
            { PageNo: pageNo },
            function (resultData) {
                $(".account-main__content").html(resultData);
                window.gktooltip($('.account-main__content'));
            },
            null
        );
    };

    BAPS.iConnect.getRoleRules = function () {
        var data = { RoleIDEQS: $(this).val() };

        BAPS.Ajax.GetHTML(
            BAPS.Routes.iConnectRoleRules,
            data,
            function (resultData) {
                $(".iConnectRoles .role-perms").replaceWith(resultData);
                BAPS.Core.ReattachCheckboxes();
            },
            null
        );
    };

    BAPS.iConnect.saveRoleRules = function (event) {
        event.preventDefault();

        var data = $(this).serializeObject();
        //data = BAPS.Core.DataObjectArrayToList(data, "Rules.RuleIDEQS");

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.iConnectSaveRoleRules,
            data,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.Core.SuccessAlert(resultData.Message);
                }
                else {
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
                //$(".iConnectRoles .role-perms").replaceWith(resultData);
            },
            null
        );
    };

    BAPS.iConnect.addEditRole = function (event) {
        event.preventDefault();

        if (!BAPS.Core.ValidateForm(this, BAPS.iConnect.AddFormError, BAPS.iConnect.RemoveFormErrors)) {
            return false;
        }

        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.iConnectSaveRole,
            $(this).serializeObject(),
            BAPS.Ajax.defaultRedirectOrErrorHandler
        );
    };

    BAPS.iConnect.loadReport = function (event) {
        event.preventDefault();

        var route = BAPS.Core.GetRouteFromFormAction(this);

        var data = $(this).serializeObject();
        // datepicker creates an input element with _submit appended to the name. This has the value we want in it.
        if (data["DateFrom_submit"]) {
            data.DateFrom = data.DateFrom_submit;
            data.DateTo = data.DateTo_submit;
        }

        BAPS.Ajax.GetHTML(
            route,
            data,
            function (resultData) {
                $(BAPS.iConnect.reportsContainer + ' .history').replaceWith(resultData);
            }
        );
    };

    BAPS.iConnect.reportToExcel = function (event) {
        event.preventDefault();

        var table = $('table.history__table');
        var tableCSV = BAPS.iConnect.convertToCsv(table.first());

        var type = "text/csv;charset=" + document.characterSet.toLowerCase();
        BAPS.console.log(type);
        var blob = new Blob([tableCSV], { type: type });
        saveAs(blob, table.data(BAPS.iConnect.DataKeys.FileName));
    };

    BAPS.iConnect.convertToCsv = function (table) {
        var options = {
            separator: ',',
            newline: '\n',
            quoteFields: true
        };

        var output = "";

        var rows = table.find('tr');

        var numCols = rows.first().find("td,th").filter(":visible").length;

        rows.each(function () {
            $(this).find("td,th").filter(":visible")
                .each(function (i, col) {
                    col = $(col);

                    output += options.quoteFields ? BAPS.iConnect.Quote(col.text()) : col.text();
                    if (i !== numCols - 1) {
                        output += options.separator;
                    } else {
                        output += options.newline;
                    }
                });
        });
        BAPS.console.log(output);
        return output;
    };

    BAPS.iConnect.Quote = function (text) {
        return '"' + text.replace('"', '""') + '"';
    };

    BAPS.iConnect.searchForReportUser = function (event) {
        event.preventDefault();

        var data = $(this).serializeObject();

        if (data.CustomerIDEQS === "0") {
            delete data.CustomerIDEQS;
        }
        //
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.SearchUsersReports,
            data,
            BAPS.iConnect.handleReportUserSearchResults,
            null
        );
    };

    BAPS.iConnect.handleReportUserSearchResults = function (resultData) {
        var table = $('table.add-modal__table');
        var tableBody = table.children('tbody');
        tableBody.children().remove();

        $.each(resultData.Results, function () {
            var html = BAPS.Core.MergeTemplateAndObject(BAPS.iConnect.reportUserSearchResultsTemplate, this);
            html = BAPS.Core.ReplaceTemplateString(html, 'add', tableBody.data(BAPS.iConnect.DataKeys.addTranslation));

            tableBody.append($(html));
        });
        BAPS.Core.PaginateTable(table);
    };

    BAPS.iConnect.reportUserSearchResultsTemplate = '<tr><td>{Name}</td><td>{CustomerName}</td><td class="last"><a href="#" class="add-modal__trigger" data-id="{ContactIDEQS}" data-name="{Name}">{add}</a></td></tr>';

    BAPS.iConnect.selectReportUser = function (event) {
        event.preventDefault();

        var link = $(this);
        $('form.baps-reports input.report-employee').val(link.data(BAPS.iConnect.DataKeys.ID));
        $('form.baps-reports .history-filters__name').text(link.data(BAPS.iConnect.DataKeys.Name));

        BAPS.Core.CloseModal();

        $(BAPS.iConnect.reportsContainer + ' .history').children().remove();
    };
    
    BAPS.iConnect.approvalsDeptChange = function () {
        var DeptID = $(this).val();

        BAPS.iConnect.getDeptApprovals(DeptID);

        $('#addLevelDept').val(DeptID);

        $('#addUserDept').val(DeptID);

        $('#addLevelBlock').show();
    };

    BAPS.iConnect.getDeptApprovals = function (DepartmentIDEQS) {
        var data = { DepartmentIDEQS: DepartmentIDEQS };

        BAPS.Ajax.GetHTML(
            BAPS.Routes.iConnectApprovalWorkflowDepartment,
            data,
            BAPS.iConnect.replaceDeptApprovalsHTML,
            null
        );
    };

    BAPS.iConnect.replaceDeptApprovalsHTML = function (resultData) {
        $(".iConnectApproval .sign-off__section:not(#addLevelBlock)").remove();
        $(resultData).insertAfter('.iConnectApproval .sign-off__header');
    };

    BAPS.iConnect.getLevelBlockFromElement = function (el) {
        return $(el).parents('.approval-levels');
    };

    BAPS.iConnect.getDeptBlockFromElement = function (el) {
        return $(el).siblings('.department-container');
    };

    BAPS.iConnect.getSectionBlockFromElement = function (el) {
        return $(el).parents('.sign-off__section');
    };

    BAPS.iConnect.getActivePassiveContainer = function (el) {
        return $(el).parents('.approval-levels__section');
    };

    BAPS.iConnect.removeApprovalLevel = function (event) {
        event.preventDefault();

        var sendingSection = BAPS.iConnect.getSectionBlockFromElement(this);
        var sendingLevel = BAPS.iConnect.getLevelBlockFromElement(this);
        var sendingDept = BAPS.iConnect.getDeptBlockFromElement(sendingSection);

        var data = {
            DepartmentIDEQS: sendingDept.data(BAPS.iConnect.DataKeys.ID),
            SignoffLevelEQS: sendingLevel.data(BAPS.iConnect.DataKeys.ID)
        };

        //$('.deleteLevelConfirm .cart-remove__header').children('span').remove();
        //$('.deleteLevelConfirm .cart-remove__header').append($('<span>').text(' abc'));
        $('.deleteLevelConfirm .cart-remove__header').text($(this).text());

        BAPS.Core.YesNoModal('.deleteLevelConfirm', function () {
            BAPS.Ajax.PostHTML(
                BAPS.Routes.iConnectDeleteApprovalLevel,
                data,
                BAPS.iConnect.replaceDeptApprovalsHTML,
                null
            );
        });
    };
    
    BAPS.iConnect.enableDisableAddLevelButton = function (event) {
        event.preventDefault();

        if ($(this).val() === '-1') {
            //$('#addLevelBlock .sign-off__submit').attr('disabled', 'disabled');
        }
        else {
            $('#addLevelBlock .sign-off__submit').removeAttr('disabled');
        }
    };

    BAPS.iConnect.addApprovalLevel = function (event) {
        event.preventDefault();

        var form = $(this);
        var data = form.serializeObject();
        BAPS.console.log(data);
        if (data.NewLevelType === -1) {
            BAPS.Core.ErrorAlert(form.data(BAPS.iConnect.DataKeys.Error));
        }
        else {
            BAPS.Ajax.PostHTML(
                BAPS.Routes.iConnectAddApprovalLevel,
                data,
                BAPS.iConnect.replaceDeptApprovalsHTML,
                null
            );
        }

    };

    BAPS.iConnect.launchAddApprovalUser = function (event) {
        event.preventDefault();

        var sendingLevel = BAPS.iConnect.getLevelBlockFromElement(this);
        var activePassiveContainer = BAPS.iConnect.getActivePassiveContainer(this);

        $('#addUserLevel').val(sendingLevel.data(BAPS.iConnect.DataKeys.ID));
        $('#addUserLevelType').val(sendingLevel.data(BAPS.iConnect.DataKeys.Type));
        $('#addUserType').val(activePassiveContainer.data(BAPS.iConnect.DataKeys.Type));

        BAPS.Core.OpenModal('.add-modal-outer');
        //$.magnificPopup.open({
        //    items: { src: ".add-modal-outer", type: "inline" }
        //}, 0)
    };

    BAPS.iConnect.searchForApprovalUser = function (event) {
        event.preventDefault();

        var data = $(this).serializeObject();

        if (data.CustomerIDEQS === "0") {
            delete data.CustomerIDEQS;
        }
        //
        BAPS.Ajax.PostFormGetJson(
            BAPS.Routes.iConnectSearchUsersForApprovalLevel,
            data,
            BAPS.iConnect.handleApprovalUserSearchResults,
            null
        );
    };

    BAPS.iConnect.handleApprovalUserSearchResults = function (resultData) {
        var table = $('.add-modal table.add-modal__table');
        var tableBody = table.children('tbody');
        tableBody.children().remove();

        $.each(resultData.Results, function () {
            var html = BAPS.Core.MergeTemplateAndObject(BAPS.iConnect.approvalUserSearchResultsTemplate, this);
            html = BAPS.Core.ReplaceTemplateString(html, 'add', tableBody.data(BAPS.iConnect.DataKeys.addTranslation));

            tableBody.append($(html));
        });
        BAPS.Core.PaginateTable(table);
    };

    BAPS.iConnect.approvalUserSearchResultsTemplate = '<tr><td>{Name}</td><td>{CustomerName}</td><td class="last"><a href="#" class="add-modal__trigger" data-id="{ContactIDEQS}">{add}</a></td></tr>';

    BAPS.iConnect.addApprovalUser = function (event) {
        event.preventDefault();

        BAPS.Core.CloseModal();

        var data = $('form.add-modal__form').serializeObject();

        data.ContactIDEQS = $(this).data(BAPS.iConnect.DataKeys.ID);

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectAddApprovalAuthority,
            data,
            BAPS.iConnect.replaceDeptApprovalsHTML,
            null
        );
    };

    BAPS.iConnect.removeApprovalUser = function (event) {
        event.preventDefault();

        var sendingSection = BAPS.iConnect.getSectionBlockFromElement(this);
        var sendingLevel = BAPS.iConnect.getLevelBlockFromElement(this);
        var sendingDept = BAPS.iConnect.getDeptBlockFromElement(sendingSection);
        var sendingUser = $(this);
        var activePassiveContainer = BAPS.iConnect.getActivePassiveContainer(this);


        var data = {
            DepartmentIDEQS: sendingDept.data(BAPS.iConnect.DataKeys.ID),
            LevelEQS: sendingLevel.data(BAPS.iConnect.DataKeys.ID),
            ContactIDEQS: sendingUser.data(BAPS.iConnect.DataKeys.ID),
            ApprovalType: activePassiveContainer.data(BAPS.iConnect.DataKeys.Type),
            LevelType: sendingLevel.data(BAPS.iConnect.DataKeys.Type)
        };

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectRemoveApprovalAuthority,
            data,
            BAPS.iConnect.replaceDeptApprovalsHTML,
            null
        );

    };

    BAPS.iConnect.addApprovalDelegateUser = function (event) {
        event.preventDefault();

        BAPS.Core.CloseModal();

        var data = {
            ContactIDEQS: $(this).data(BAPS.iConnect.DataKeys.ID),
            FromDate: $('#FromDate').val(),
            ToDate: $('#ToDate').val(),
        };

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectAddApprovalDelegate,
            data,
            BAPS.iConnect.refreshDelegations,
            null
        );
    };

    BAPS.iConnect.removeApprovalDelegateUser = function (event) {
        event.preventDefault();

        var btn = $(this);

        var data = {
            ContactIDEQS: btn.data(BAPS.iConnect.DataKeys.ContactIDEQS),
            RecordIDEQS: btn.data(BAPS.iConnect.DataKeys.ID),
        };

        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectRemoveApprovalDelegate,
            data,
            BAPS.iConnect.refreshDelegations,
            null
        );
    };

    BAPS.iConnect.refreshDelegations = function () {
        BAPS.Ajax.PostHTML(
            BAPS.Routes.iConnectApprovalDelegationList,
            null,
            function (resultData) {
                $('#approvalDelegation').replaceWith(resultData);
            },
            null
        );
    };

    BAPS.iConnect.showExternalLaunchMessage = function (event) {
        event.preventDefault();

        BAPS.Core.OpenModal('.external-Launch');
    };


    BAPS.iConnect.showLaunchMessage = function (event) {
        var courseName = $(this).data('name');

        $('.launching-Course').find('.change-name__desc span').text(courseName);

        BAPS.Core.OpenModal('.launching-Course');

        setTimeout(function () { BAPS.Core.CloseModal(); }, 10000);
    };

    BAPS.iConnect.showCPLLLaunchMessage = function (event) {
        event.preventDefault();

        $('.launch-CPLL').find('a').attr('href', $(this).data('url'));

        BAPS.Core.OpenModal('.launch-CPLL');
    };


    BAPS.iConnect.disableLaunchButton = function () {
        $(this).hide();
    };

    /* These are used to override the default form error show and hide methods used in the BAPS.Core.ValidateForm method */
    BAPS.iConnect.AddFormError = function (inputElement, errorMessage) {
        var errorDiv = $("<div class=\"errorMessage\"></div>");
        var parentDiv = inputElement.closest("div");
        parentDiv.addClass("has-error");
        parentDiv.append(errorDiv);
        errorDiv.append(errorMessage);
    };

    BAPS.iConnect.RemoveFormErrors = function (form) {
        $(form).find("li").removeClass("has-error");
        $(form).find("li div.errorMessage").remove();
    };
}