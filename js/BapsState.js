BAPSObject.prototype.StateInit = function ($) {
    BAPS.State = {
        suspendSubmit: false,

        init: function () {
            if (BAPS.elementExists('form.baps_WithState')) {
                BAPS.State.attachState();
            }
        },

        attachState: function () {
            BAPS.console.log(history.state);

            // FF, Chrome, Safari, IE9.
            if (history.pushState) {
                // Event listener to capture when user pressing the back and forward buttons within the browser.
                $(window).bind("popstate", BAPS.State.loadStateHtml5Handler);
            }
            // IE8.
            else {
                // Event listener to cature address bar updates with hashes.
                $(window).bind("onhashchange", BAPS.State.loadStateLegacy);
            }

            if (history.state === null) {
                BAPS.console.log('no state');
                BAPS.State.saveState(true);
            }
            else {
                BAPS.console.log('reapply state');
                // FF, Chrome, Safari, IE9.
                if (history.pushState) {
                    // Event listener to capture when user pressing the back and forward buttons within the browser.
                    BAPS.State.loadStateHtml5(history.state);
                }
                // IE8.
                else {
                    // Event listener to cature address bar updates with hashes.
                    BAPS.State.loadStateLegacy();
                }
            }
        },

        searchComplete: function (form) {
            if (form.data('saveStateOnComplete') || form.data('saveStateOnComplete') === undefined) {
                BAPS.State.saveState(false);
            }
            form.data('saveStateOnComplete', true);
        },

        // Saves the currently selected values of the search filters
        saveState: function (replace) {
            var state = BAPS.State.getCleanState();
            BAPS.console.log(state);

            // Change URL with browser address bar using the HTML5 History API.
            if (history.pushState) {
                // Parameters: data, page title, URL 
                if (replace) {
                    BAPS.console.log('replaceState');
                    history.replaceState(state, null, null);
                }
                else {
                    BAPS.console.log('pushState');
                    history.pushState(state, null, document.location.pathname + '?' + state);
                }
            }
            // Fallback for non-supported browsers.
            else {
                document.location.hash = state;
            }
        },

        getCleanState: function () {
            if ($('form.baps_WithState').length == 0)
                return;

            var stateCleaned = '';

            $.each($('form.baps_WithState'), function () {
                var form = $(this);
                var state = form.find('input, select').not('.urls').serialize();

                var formName = form.attr('name');

                $.each(state.split('&'), function () {
                    if (this.substring(0, 11) !== 'multiselect') {
                        //BAPS.console.log(this);
                        stateCleaned = stateCleaned + '&' + formName + '|' + this;
                        //BAPS.console.log(stateCleaned);
                    }
                });
            });

            // remove leading &
            stateCleaned = stateCleaned.substring(1);

            BAPS.console.log(stateCleaned);

            return btoa(stateCleaned);
        },

        // Sets the loaded state
        loadStateHtml5Handler: function (e) {
            BAPS.console.log('loadStateHtml5Handler');

            BAPS.State.loadStateHtml5(e.originalEvent.state);
        },

        // Sets the loaded state
        loadStateHtml5: function (state) {
            BAPS.console.log('loadStateHtml5');
            BAPS.State.loadStateCore(state);
        },

        // Sets the loaded state
        loadStateLegacy: function () {
            BAPS.console.log('loadStateLegacy');

            BAPS.State.loadStateCore(document.location.hash.substring(1));
        },

        loadStateCore: function (state) {
            if (state !== undefined) {
                // stop automatic submission of the form
                BAPS.State.suspendSubmit = true;
                BAPS.State.resetFilters();

                state = atob(state);
                BAPS.console.log(state);
                var selects = {};

                $.each(state.split('&'), function () {
                    vals = this.split('=');
                    key = vals[0];
                    value = vals[1];

                    keySplit = key.split('|');

                    var formName = keySplit[0];
                    var inputName = keySplit[1];

                    var cntrl = $('form[name="' + formName + '"]').find('[name="' + inputName + '"]');

                    if (cntrl.is("select")) {
                        cntrl[0].selectize.setValue(value, true);
                    }

                    else {
                        cntrl.val(decodeURI(value).replace(/%2C/g, ",").replace(/%2F/g, "/"));
                    }
                });

                // re-enable automatic submission of the form
                BAPS.State.suspendSubmit = false;

                $.each($('form.baps_WithState'), function () {
                    var form = $(this);
                    BAPS.State.reloadResults(form);
                });
                
            }
            else {
                //console.log('noop');
            }
        },

        reloadResults: function (form) {
            BAPS.console.log('reload');
            form.data('saveStateOnComplete', false);
            form.trigger('submit');
        },

        resetFilters: function () {
            BAPS.console.log('resetFilters');

            //BAPS.SelectReplaceWrapper.clearAllSelectsInElement(BAPS.State.form);

            //BAPS.State.form.find('input:not(:hidden)').val('');
        }
    };


    $(document).ready(function () {
        BAPS.State.init();
    });

}