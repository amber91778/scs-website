BAPSObject.prototype.cartInit = function ($) {
    //Shortcut out if not required.
    if (!BAPS.elementExists('.cart-overview-wrap')) {
        return;
    }

    BAPS.Cart = {};

    BAPS.Cart.CartWrapper = 'body'; // this is what we will use for attaching event listeners

    BAPS.Cart.DataKeys = {
        EventNumberEQS: 'eventnumbereqs',
        RecordIDEQS: 'recordideqs',
        ProductCodeEQS: 'productcodeeqs',
        PrepaymentIDEQS: 'prepaymentideqs',
        Sender: 'sender',
        Description: 'description',
        PrePaySelected: 'prepayselected',
        PackageSelected: 'packageselected',
        TermsError: 'terms-error',
        Virtual: 'virtual',
        Title: 'title',
        PromoCode: 'promocode'
    };

    $(document).ready(function () {
        BAPS.Cart.AttachCheckout();
    });

    BAPS.Cart.AttachCheckout = function () {
        BAPS.Cart.Rebind(true);

        // change delegate form
        $(BAPS.Cart.CartWrapper).on('submit', '.cart-registration__form', BAPS.Cart.submitDelegateSelected);
        $(BAPS.Cart.CartWrapper).on('change', '.cart-registration__dropdown', BAPS.Cart.delegateSelected);

        //add buttons
        $(BAPS.Cart.CartWrapper).on('click', '.cart-ads__add', BAPS.Cart.addRelated);
        $(BAPS.Cart.CartWrapper).on('click', '.cart-registration__add', BAPS.Cart.addDelegate);

        // delete buttons
        $(BAPS.Cart.CartWrapper).on('click', '.cart-overview__delete', BAPS.Cart.removeCourseAction);
        $(BAPS.Cart.CartWrapper).on('click', '.cart-delegates__remove', BAPS.Cart.removeDelegateAction);
        $(BAPS.Cart.CartWrapper).on('click', '.cart-ads__remove', BAPS.Cart.removeDelegateRelatedAction);

        //change delegate
        $(BAPS.Cart.CartWrapper).on('click', '.cart-registration__link', BAPS.Cart.changeDelegate);

        //prepay and packages
        $(BAPS.Cart.CartWrapper).on('click', '.cart-payment__cta.prepay, .cart-payment__selected-link.prepay', BAPS.Cart.loadPrepayments);
        $(BAPS.Cart.CartWrapper).on('click', '.cart-payment__cta.package, .cart-payment__selected-link.package', BAPS.Cart.loadPackages);
        $(BAPS.Cart.CartWrapper).on('submit', '.select-prepay__form', BAPS.Cart.setPaymentTypePrepay);
        $(BAPS.Cart.CartWrapper).on('submit', '.select-package__form', BAPS.Cart.setPaymentTypePackage);

        // attach po number change
        $(BAPS.Cart.CartWrapper).on('blur', 'input.cart-payment__input', BAPS.Cart.savePONumber);
        $(BAPS.Cart.CartWrapper).on('keydown', 'input.cart-payment__input', BAPS.Cart.savePONumberOnEnter);

        //attach promo code
        $(BAPS.Cart.CartWrapper).on('keydown', '#addPromo', BAPS.Cart.ClearPromoError);
        $('.cart-total__form').off('submit'); // remove Verndale binding 
        $(BAPS.Cart.CartWrapper).on('submit', '.cart-total__form', BAPS.Cart.ApplyPromoCode);
        $(BAPS.Cart.CartWrapper).on('click', '.cart-promos__remove', BAPS.Cart.RemovePromoCode);

        // confirm order!
        $(BAPS.Cart.CartWrapper).on('submit', '.cart-totals__form', BAPS.Cart.createBookings);
        //$('.cart-totals__form').on('submit', BAPS.Cart.createBookings);

        // selected prepay validation
        //$(BAPS.Cart.CartWrapper).on('click', '.cart-payment .cart-footer__next', BAPS.Cart.ValidatePrepayments);

        // remove external tracking
        $(BAPS.Cart.CartWrapper).on('click', '#remove_external', BAPS.Cart.RemoveExternalTracking);
    };

    BAPS.Cart.Rebind = function (pageLoad) {
        $('select.cart-registration__dropdown:not(.selectized)').selectize();
        $('select.cart-payment__dropdown:not(.selectized)').selectize();

        // attach to selectize events for delegate search
        $.each($('.cart-registration__dropdown.selectized'), function () {
            $(this)[0].selectize.on('type', BAPS.Cart.doDelegateSearch);
        });

        //// attach to selectize events for payment choice
        $.each($('.cart-payment__dropdown.selectized'), function () {
            $(this)[0].selectize.on('item_add', BAPS.Cart.paymentTypeSelected);
        });
    };

    BAPS.Cart.changeDelegate = function (event) {
        event.preventDefault();
        var link = $(this);
        var form = link.closest('.cart-registration__form');
        var linkGroup = form.find('.cart-registration__link-group').addClass('hidden');
        var dropdown = form.find('.cart-registration__dropdown');

        linkGroup.addClass('hidden');
        dropdown.removeClass('hidden');
        dropdown[0].selectize.clear();
    };

    BAPS.Cart.doDelegateSearch = function (searchString) {
        var searchingDropdown = this;
        if (searchString.length === 2) { // > 1
            var data = BAPS.Cart.getDelegateChangeDataObject(searchingDropdown);
            data.Keyword = searchString;

            BAPS.Ajax.PostFormGetJson(BAPS.Routes.SearchUsers,
                data,
                function (resultData) {
                    BAPS.Cart.handleDelegateSearchSuccess(searchingDropdown, resultData);
                },
                null,
                false);
        }
        else if (searchString.length < 2) {
            BAPS.Cart.clearOutDelegateSearchResults(searchingDropdown);
        }
    };

    BAPS.Cart.getDelegateChangeDataObject = function (item) {
        var form = item.$input.closest('form');

        var data = form.serializeObject();

        // tidy up
        delete data.DelegateIDEQS;

        return data;
    };

    BAPS.Cart.clearOutDelegateSearchResults = function (searchingDropdown) {
        $.each(searchingDropdown.options, function () {
            if (this.optgroup === 'Delegates') {
                searchingDropdown.removeOption(this.value);
            }
        });
    };

    BAPS.Cart.handleDelegateSearchSuccess = function (searchingDropdown, resultData) {
        BAPS.Cart.clearOutDelegateSearchResults(searchingDropdown);

        $.each(resultData.Results, function () {
            searchingDropdown.addOption({ value: this.ContactIDEQS, text: this.Name, optgroup: 'Delegates' }); //Delegates
        });
        searchingDropdown.open();
    };

    BAPS.Cart.delegateSelected = function (event) {
        var dropdown = $(event.currentTarget);
        var form = dropdown.closest('.cart-registration__form');
        var selectize = event.currentTarget.selectize;
        var value = selectize.getValue();
        if (!value) {
            return;
        }
        var option = selectize.options[value];
        if (option.url) {
            window.location.href = option.url;
            return;
        }
        if (form.length) {
            form.submit();
        }
    };

    BAPS.Cart.submitDelegateSelected = function (event) {
        event.preventDefault();

        var form = $(this);
        var data = form.serializeObject();

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.UpdateDelegateInBasket,
            data,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.console.log('Update Delegate Success');

                    var linkGroup = form.find('.cart-registration__link-group');
                    var selected = form.find('.cart-registration__selected');
                    var dropdown = form.find('.cart-registration__dropdown');

                    linkGroup.removeClass('hidden');
                    dropdown.addClass('hidden');
                    selected.text(dropdown[0].selectize.options[dropdown.val()].text);
                }
                else {
                    BAPS.console.log('Update Delegate Failed');
                    // clear dropdown
                    form.find('.cart-registration__dropdown')[0].selectize.clear();
                    // show error
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                }
            });
    };

    BAPS.Cart.addDelegate = function () {
        var block = $(this).parents('section.cart-overview');

        var data = BAPS.Cart.BasicDataItem(block.data(BAPS.Cart.DataKeys.EventNumberEQS), block.data(BAPS.Cart.DataKeys.ProductCodeEQS), null, block.data(BAPS.Cart.DataKeys.Virtual));

        var route;

        if (BAPS.elementExists('.cart-registration')) {
            route = BAPS.Routes.AddDelegateToCartRegistration;
        }
        else if (BAPS.elementExists('.cart-payment')) {
            route = BAPS.Routes.AddDelegatePayment;
        }
        else {
            route = BAPS.Routes.AddDelegateToCart;
        }

        BAPS.Ajax.PostHTML(
            route,
            data,
            function (resultData) {
                BAPS.Cart.addDelegateSuccess(block, resultData);
            },
            BAPS.Ajax.JsonErrorFromHtmlAction);
    };

    BAPS.Cart.addDelegateSuccess = function (block, resultData) {
        BAPS.Cart.RefreshWholeCart();
    };

    BAPS.Cart.removeCourseAction = function () {
        var sender = $(this);
        var data = BAPS.Cart.BasicDataItem(sender.data(BAPS.Cart.DataKeys.EventNumberEQS), sender.data(BAPS.Cart.DataKeys.ProductCodeEQS), null);

        BAPS.Core.CloseModal();

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.DeleteFromBasket,
            data,
            function (resultData) {
                if (resultData.Success) {
                    if (resultData.Summary.Rows === 0) {
                        BAPS.Cart.RemoveCourseBlockElement(sender.data(BAPS.Cart.DataKeys.EventNumberEQS));
                        BAPS.Cart.RemoveProductBlockElement(sender.data(BAPS.Cart.DataKeys.ProductCodeEQS));
                    }
                    else {
                        BAPS.Cart.RefreshWholeCart();
                    }
                }
                else {
                    BAPS.console.log('Remove Course Failed');
                }
            });
    };

    BAPS.Cart.RemoveCourseBlockElement = function (EventNumberEQS) {
        var courseBlock = $('[data-eventnumbereqs="' + EventNumberEQS + '"]');
        BAPS.Core.Remove(courseBlock.prev());
        BAPS.Core.Remove(courseBlock, BAPS.Cart.showEmpty);
    };

    BAPS.Cart.RemoveProductBlockElement = function (ProductCodeEQS) {
        var productBlock = $('[data-productcodeeqs="' + ProductCodeEQS + '"]');
        BAPS.Core.Remove(productBlock.prev());
        BAPS.Core.Remove(productBlock, BAPS.Cart.showEmpty);
    };

    BAPS.Cart.removeDelegateAction = function () {
        var sender = $(this);

        var data = BAPS.Cart.BasicDataItem(sender.data(BAPS.Cart.DataKeys.EventNumberEQS), sender.data(BAPS.Cart.DataKeys.ProductCodeEQS), sender.data(BAPS.Cart.DataKeys.RecordIDEQS));

        BAPS.Core.CloseModal();

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.DeleteFromBasket,
            data,
            function (resultData) {
                if (resultData.Success) {
                    if (resultData.Summary.Rows === 0) {
                        BAPS.Cart.RemoveCourseBlockElement(sender.data(BAPS.Cart.DataKeys.EventNumberEQS));
                        BAPS.Cart.RemoveProductBlockElement(sender.data(BAPS.Cart.DataKeys.ProductCodeEQS));
                    }
                    else {
                        BAPS.Cart.RefreshWholeCart();
                    }
                }
                else {
                    BAPS.console.log('Remove Delegate Failed');
                }
            });
    };

    BAPS.Cart.removeDelegateRelatedAction = function () {
        var sender = $(this);

        var data = BAPS.Cart.BasicDataItem(sender.data(BAPS.Cart.DataKeys.EventNumberEQS), sender.data(BAPS.Cart.DataKeys.ProductCodeEQS), sender.data(BAPS.Cart.DataKeys.RecordIDEQS));

        BAPS.Core.CloseModal();

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.DeleteFromBasket,
            data,
            function (resultData) {
                if (resultData.Success) {
                    // update whole checkout (only way to get the just removed line back as an add line)!
                    BAPS.Cart.RefreshWholeCart();
                }
                else {
                    BAPS.console.log('Remove Delegate releated Failed');
                }
            });
    };

    BAPS.Cart.BasicDataItem = function (EventNumberEQS, ProductCodeEQS, RecordIDEQS, Virtual) {
        var data = {};

        data.EventNumberEQS = EventNumberEQS;

        if (ProductCodeEQS !== null) {
            data.ProductCodeEQS = ProductCodeEQS;
        }

        if (RecordIDEQS !== null) {
            data.RecordIDEQS = RecordIDEQS;
        }

        if (Virtual !== null) {
            data.Virtual = Virtual;
        }

        return data;
    };

    BAPS.Cart.paymentTypeSelected = function (value, item) {
        var paymentDropdown = this;
        paymentDropdown.close();

        var paymentContainer = paymentDropdown.$input.closest('.cart-payment__wrapper');

        var payMethod = value;

        BAPS.Cart.resetAllPaymentTypes(paymentContainer);
        BAPS.Cart.activatePaymentType(payMethod, paymentContainer);
        BAPS.Cart.setPaymentType(payMethod, paymentContainer);

        BAPS.Analytics.AddPaymentInfo(paymentDropdown.$input, payMethod);
    };

    BAPS.Cart.setPaymentType = function (payMethod, paymentContainer) {
        var data = BAPS.Cart.BasicDataItem(paymentContainer.data(BAPS.Cart.DataKeys.EventNumberEQS), paymentContainer.data(BAPS.Cart.DataKeys.ProductCodeEQS), paymentContainer.data(BAPS.Cart.DataKeys.RecordIDEQS));

        switch (payMethod) {
            case 'invoice':
                BAPS.Cart.setPaymentTypeInner(data, BAPS.Routes.SetPayInvoice);
                break;

            case 'card':
                BAPS.Cart.setPaymentTypeInner(data, BAPS.Routes.SetPayCard);
                break;

            case 'package':
                //url = BAPS.Routes.SetPayPackage;
                break;
        }
    };

    BAPS.Cart.setPaymentTypePrepay = function (event) {
        event.preventDefault();

        var form = $(this);
        var data = form.serializeObject();

        if (!data.PrepaymentIDEQS) {
            //BAPS.Core.ErrorAlert('help!');
            return false;
        }

        BAPS.console.log(data);

        var prePayDesc = form.find('input[name=PrepaymentIDEQS]:checked').data(BAPS.Cart.DataKeys.Description);

        BAPS.Ajax.PostHTML(BAPS.Routes.SetPaySkillsLicense,
            data,
            function (resultData) {
                //if (resultData.Success) {
                    BAPS.console.log('Update PrePayment Success');
                    BAPS.Core.CloseModal();
                    $('.select-prepay-package').html('');

                    var paymentContainer;

                    if (data.EventNumberEQS.length > 0) {
                        BAPS.console.log('Event');
                        paymentContainer = $('.cart-payment__wrapper[data-' + BAPS.Cart.DataKeys.EventNumberEQS + '="' + data.EventNumberEQS + '"][data-' + BAPS.Cart.DataKeys.RecordIDEQS + '="' + data.RecordIDEQS + '"]');
                    }
                    else {
                        BAPS.console.log('Products');
                        paymentContainer = $('[data-' + BAPS.Cart.DataKeys.ProductCodeEQS + '="' + data.ProductCodeEQS + '"]');
                    }                   
                    BAPS.console.log(paymentContainer);
                    paymentContainer.find('.prepay-choosen .cart-payment__selected-label').text(prePayDesc);
                    paymentContainer.find('.prepay-choosen .cart-payment__selected-link').data(BAPS.Cart.DataKeys.PrepaymentIDEQS, data.PrepaymentIDEQS);
                    paymentContainer.find('.prepay-none').hide();
                    paymentContainer.find('.prepay-choosen').show();
                    paymentContainer.data(BAPS.Cart.DataKeys.PrePaySelected, true);

                    BAPS.Cart.setPaymentTypeUpdateTotals(resultData);
                //}
                //else {
                //    BAPS.console.log('Update PrePayment Failed');
                //}
            });
    };

    BAPS.Cart.setPaymentTypePackage = function (event) {
        event.preventDefault();

        var form = $(this);
        var data = form.serializeObject();

        if (!data.PrepaymentIDEQS) {
            //BAPS.Core.ErrorAlert('help!');
            return false;
        }

        // This is looking for PrepaymentIDEQS even though this is packages as when saved to db the same input is used!
        var packageDesc = form.find('input[name=PrepaymentIDEQS]:checked').data(BAPS.Cart.DataKeys.Description);

        BAPS.Ajax.PostHTML(BAPS.Routes.SetPayPackage,
            data,
            function (resultData) {
                //if (resultData.Success) {
                    BAPS.console.log('Update Package Success');
                    BAPS.Core.CloseModal();
                    $('.select-prepay-package').html('');

                    var paymentContainer = $('.cart-payment__wrapper[data-' + BAPS.Cart.DataKeys.EventNumberEQS + '="' + data.EventNumberEQS + '"][data-' + BAPS.Cart.DataKeys.RecordIDEQS + '="' + data.RecordIDEQS + '"]');
                    paymentContainer.find('.package-choosen .cart-payment__selected-label').text(packageDesc);
                    paymentContainer.find('.package-choosen .cart-payment__selected-link').data(BAPS.Cart.DataKeys.PrepaymentIDEQS, data.PrepaymentIDEQS);
                    paymentContainer.find('.package-none').hide();
                    paymentContainer.find('.package-choosen').show();
                    paymentContainer.data(BAPS.Cart.DataKeys.PackageSelected, true);

                    BAPS.Cart.setPaymentTypeUpdateTotals(resultData);
                //}
                //else {
                //    BAPS.console.log('Update Package Failed');
                //}
            });
    };

    BAPS.Cart.setPaymentTypeInner = function (data, url) {
        BAPS.Ajax.PostHTML(url,
            data,
            function (resultData) {
                //if (resultData.Success) {
                    BAPS.console.log('Update Payment Success');
                    BAPS.Cart.setPaymentTypeUpdateTotals(resultData);
                //}
                //else {
                //    BAPS.console.log('Update Payment Failed');
                //}
            });
    };

    BAPS.Cart.setPaymentTypeUpdateTotals = function (resultData) {
        // replace totals html
        $('div.cart-totals').replaceWith(resultData);
    };
    BAPS.Cart.loadPrepayments = function () {
        var sender = $(this);
        var paymentContainer = sender.closest('.cart-payment__wrapper');

        var data = BAPS.Cart.BasicDataItem(
            paymentContainer.data(BAPS.Cart.DataKeys.EventNumberEQS),
            paymentContainer.data(BAPS.Cart.DataKeys.ProductCodeEQS),
            paymentContainer.data(BAPS.Cart.DataKeys.RecordIDEQS)
        );

        data.PrePaymentIDEQS = $(sender).data(BAPS.Cart.DataKeys.PrepaymentIDEQS);

        BAPS.Ajax.GetHTML(BAPS.Routes.Prepayments, data, function (resultData) {
            $('.select-prepay-package').replaceWith(resultData);
            BAPS.Core.OpenModal('.select-prepay-package', 'select-prepay-wrapper');
        });
    };

    BAPS.Cart.loadPackages = function () {
        var sender = $(this);
        var paymentContainer = sender.closest('.cart-payment__wrapper');

        var data = BAPS.Cart.BasicDataItem(
            paymentContainer.data(BAPS.Cart.DataKeys.EventNumberEQS),
            paymentContainer.data(BAPS.Cart.DataKeys.ProductCodeEQS),
            paymentContainer.data(BAPS.Cart.DataKeys.RecordIDEQS)
        );

        data.PrePaymentIDEQS = $(sender).data(BAPS.Cart.DataKeys.PrePaymentIDEQS);

        BAPS.Ajax.GetHTML(BAPS.Routes.Packages, data, function (resultData) {
            $('.select-prepay-package').replaceWith(resultData);
            BAPS.Core.OpenModal('.select-prepay-package', 'select-package-wrapper');
        });
    };

    BAPS.Cart.resetAllPaymentTypes = function (paymentContainer) {
        paymentContainer.children('.cart-payment__result').hide();
        paymentContainer.find('.cart-payment__input').val('');
        paymentContainer.data(BAPS.Cart.DataKeys.PrePaySelected, false);
        paymentContainer.data(BAPS.Cart.DataKeys.PackageSelected, false);
    };

    BAPS.Cart.activatePaymentType = function (payMethod, paymentContainer) {
        switch (payMethod) {
            case 'prepay':
                paymentContainer.find('.prepay').parent().show();
                paymentContainer.find('.prepay').focus();
                break;

            case 'package':
                paymentContainer.find('.package').parent().show();
                paymentContainer.find('.package').focus();
                break;

            case 'invoice':
                paymentContainer.find('.cart-payment__input').parent().show();
                paymentContainer.find('.cart-payment__input').focus();
                console.log(document.activeElement);
                break;

            case 'card':
                $('.cart-footer__next').focus();
                break;
        }
    };

    BAPS.Cart.savePONumber = function (event) {
        //BAPS.console.log(event);
        var ctrl = $(this);

        BAPS.Cart.ClearErrorColor(ctrl);

        var paymentContainer = ctrl.closest('.cart-payment__wrapper');

        var data = BAPS.Cart.BasicDataItem(paymentContainer.data(BAPS.Cart.DataKeys.EventNumberEQS), null, paymentContainer.data(BAPS.Cart.DataKeys.RecordIDEQS));
        data.OrderNumber = ctrl.val();

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.SetOrderNumber,
            data,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.console.log('Update po num Success');
                    ctrl.data('success', true);
                    // if the blur was caused by a click the next button then make sure that click occurs
                    if (event !== null && event.relatedTarget !== null) {
                        if ($(event.relatedTarget).hasClass('cart-footer__next')) {
                            BAPS.console.log('trigger click');
                            event.relatedTarget.click();
                        }
                    }

                }
                else {
                    BAPS.console.log('Update po num Failed');
                    ctrl.data('success', false);
                    BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                    BAPS.Cart.AddErrorColor(ctrl);
                    
                }
            });
    };

    BAPS.Cart.savePONumberOnEnter = function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $(this).blur();
            return false;
        }
    };

    BAPS.Cart.createBookings = function (event) {
        event.preventDefault();

        var cartForm = $(event.currentTarget);

        // validate payments first
        if (BAPS.Cart.ValidatePrepayments()) {
            var termsChecked = $('#terms').is(':checked');

            if (termsChecked) {
                var data = { AcceptTerms: true };

                BAPS.Ajax.PostFormGetJson(BAPS.Routes.MakeBookings,
                    data,
                    function (resultData) {
                        if (resultData.Success) {
                            if (resultData.RedirectType) {
                                window.location.replace(resultData.RedirectUrl);
                            }
                            else if (resultData.SubmissionType) {
                                var form = $(resultData.SubmissionForm);
                                form.insertAfter(cartForm);
                                form.submit();
                            }
                        }
                        else {
                            BAPS.Core.ErrorAlert(resultData.ErrorMessage);
                            BAPS.Ajax.hideSpinner();
                        }
                    },
                    null,
                    true,
                    true);
            }
            else {
                BAPS.Core.ErrorAlert(cartForm.data(BAPS.Cart.DataKeys.TermsError));
            }
        }
    };

    BAPS.Cart.showEmpty = function () {
        if ($('.cart-overview-wrap section').length === 0) {
            BAPS.Core.Show($('.cart-empty'));

            BAPS.Core.Hide($('.cart-overview-wrap'));
        }
    };

    BAPS.Cart.ClearPromoError = function () {
        BAPS.Core.Hide($('.cart-total__error'));
    };

    BAPS.Cart.ApplyPromoCode = function (event) {
        var form = $(event.currentTarget);
        BAPS.Cart.ClearPromoError();

        var data = form.serializeObject();

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.AddComplexPromotionCode,
            data,
            function (resultData) {
                if (resultData.Success) {
                    // update whole checkout!
                    BAPS.Cart.RefreshWholeCart();

                }
                else {
                    if (resultData.Valid) {
                        // code is valid, but not applicable to this cart.
                        if (!resultData.AllowedWithCustomerPrice) {
                            BAPS.Core.Show($('.cart-total__error.nocust'));
                        }
                        else if (resultData.AllowedWithEventDiscount) {
                            BAPS.Core.Show($('.cart-total__error.noED'));
                        }
                    }
                    else {
                        BAPS.Core.Show($('.cart-total__error.invalid'));
                    }
                }
            },
            function (resultData) {
                BAPS.Core.Show($('.cart-total__error.invalid'));
            });

        return false;
    };

    BAPS.Cart.RemovePromoCode = function (event) {
        var form = $(event.currentTarget);
        BAPS.Cart.ClearPromoError();

        var data = { PromotionCode: $(this).data(BAPS.Cart.DataKeys.PromoCode) };

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.RemoveComplexPromotionCode,
            data,
            function (resultData) {
                if (resultData.Success) {
                    // update whole checkout!
                    BAPS.Cart.RefreshWholeCart();

                }
                else {
                    BAPS.Core.Show($('.cart-total__error'));
                }
            },
            function (resultData) {
                BAPS.Core.Show($('.cart-total__error'));
            });

        return false;
    };

    BAPS.Cart.addRelated = function () {
        var button = $(this);
        data = {
            RelatedProducts: [{
                RecordIDEQS: button.data(BAPS.Cart.DataKeys.RecordIDEQS),
                EventNumberEQS: button.data(BAPS.Cart.DataKeys.EventNumberEQS),
                ProductCodeEQS: button.data(BAPS.Cart.DataKeys.ProductCodeEQS)
            }]
        };

        BAPS.Ajax.PostJsonGetJson(BAPS.Routes.AddRelatedProducts,
            data,
            function (resultData) {
                if (resultData.Success) {
                    // update whole checkout!
                    BAPS.Cart.RefreshWholeCart();
                }
            },
            function (resultData) {
                BAPS.Core.CloseModal();
            });

        return false;
    };

    BAPS.Cart.RefreshWholeCart = function () {
        if (BAPS.elementExists('.cart-registration')) {
            BAPS.Cart.RefreshRegistration();
        }
        if (BAPS.elementExists('.cart-payment')) {
            BAPS.Cart.RefreshPayment();
        }
        else {
            BAPS.Cart.RefreshOverview();
        }
    };

    BAPS.Cart.RefreshOverview = function () {
        BAPS.Ajax.GetHTML(BAPS.Routes.OverviewCore,
            null,
            function (resultData) {
                $('.cart-overview .cart-overview-wrap__inner').html(resultData);

                BAPS.Cart.Rebind();
            });
    };

    BAPS.Cart.RefreshRegistration = function () {
        BAPS.Ajax.GetHTML(BAPS.Routes.RegistrationCore,
            null,
            function (resultData) {
                $('.cart-registration .cart-overview-wrap__inner').html(resultData);

                BAPS.Cart.Rebind();
            });
    };

    BAPS.Cart.RefreshPayment = function () {
        BAPS.Ajax.GetHTML(BAPS.Routes.PaymentCore,
            null,
            function (resultData) {
                $('.cart-payment .cart-overview-wrap__inner').html(resultData);

                BAPS.Cart.Rebind();
            });
    };

    BAPS.Cart.ValidatePrepayments = function () {
        BAPS.console.log('Next page click');
        var valid = true;

        if ($('.prepay-none:visible').length !== 0) {
            BAPS.console.log('No prepay selected.');
            valid = false;
            BAPS.Core.ErrorAlert(selectPrepayErrorMessage);
        }

        if ($('.package-none:visible').length !== 0) {
            BAPS.console.log('No package selected.');
            valid = false;
            BAPS.Core.ErrorAlert(selectPackageErrorMessage);
        }

        if ($('select.cart-payment__dropdown').filter(function () { return $(this).val() === ''; }).length !== 0) {
            BAPS.console.log('No payment selected.');
            valid = false;
            BAPS.Core.ErrorAlert(selectPaymentErrorMessage);
        }

        var emptyPO = $('input.cart-payment__input:visible').filter(function () { return $(this).val() === ''; });

        if (emptyPO.length !== 0) {
            BAPS.console.log('No po number entered selected.');
            valid = false;
            BAPS.Core.ErrorAlert(enterPONumErrorMessage);

            BAPS.Cart.AddErrorColor(emptyPO);
            emptyPO[0].focus();
        }

        var invalidPO = $('input.cart-payment__input:visible').filter(function () { return $(this).data('success') === false; });

        if (invalidPO.length !== 0) {
            BAPS.console.log('Invalid po number entered selected.');
            valid = false;
            BAPS.Core.ErrorAlert(invalidPONumErrorMessage);

            BAPS.Cart.AddErrorColor(invalidPO);
            invalidPO[0].focus();
        }

        return valid;
    };

    BAPS.Cart.AddErrorColor = function (els) {
        els.css('border-color', '#be1e2d');
    };

    BAPS.Cart.ClearErrorColor = function (els) {
        els.css('border-color', '');
    };

    BAPS.Cart.RemoveExternalTracking = function () {
        BAPS.console.log('Remove External Tracking');
        var ctrl = $(this);

        BAPS.Ajax.PostFormGetJson(BAPS.Routes.RemoveExternalTracking,
            null,
            function (resultData) {
                if (resultData.Success) {
                    BAPS.console.log('Remove External Success');

                    ctrl.prop("disabled", true);

                }
                else {
                    BAPS.console.log('Remove External Failed');
                }
            });
    };

    
};