/*
* adapt-contrib-responsiveIframe
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Kevin Corry <kevinc@learningpool.com>
*/
define(function (require) {

    var ComponentView = require("coreViews/componentView");
    var Adapt = require("coreJS/adapt");

    var ResponsiveIframe = ComponentView.extend({

        events: {
            'inview': 'inview'
        },

        preRender: function () {
            this.listenTo(Adapt, 'device:changed', this.resizeControl);

            this.checkIfResetOnRevisit();

            // Set the title of the IFRAME
            var iframeTitle = this.model.get('displayTitle') || this.model.get('title');
            this.model.set("iframeTitle", iframeTitle);
        },

        checkIfResetOnRevisit: function () {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        postRender: function () {
            var that = this;
            this.$('.responsiveIframe-iframe').ready(function () {
                that.resizeControl(Adapt.device.screenSize);
                that.setReadyStatus();
            });
        },

        inview: function (event, visible) {
            if (visible) {
                this.setCompletionStatus();
            }
        },

        resizeControl: function (size) {
            var width = this.$('.responsiveIframe-iframe').attr('data-width-' + size);
            var height = this.$('.responsiveIframe-iframe').attr('data-height-' + size);
            this.$('.responsiveIframe-iframe').width(width);
            this.$('.responsiveIframe-iframe').height(height);
        }

    });

    Adapt.register("responsiveIframe", ResponsiveIframe);

});
