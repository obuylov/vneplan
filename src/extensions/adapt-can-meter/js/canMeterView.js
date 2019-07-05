define([
    'coreJS/adapt',
    'backbone'
], function (Adapt, Backbone) {

    var CanMeterView = Backbone.View.extend({

        initialize: function (options) {
            this.options = options;
            this.model = options.model;
            this.meterCurrentValue = this.model.meterCurrentValue;

            $('.can-meter-container').prepend('<div class="can-meter-' + this.model.id + '"></div>');
            this.el = $('.can-meter-' + this.model.id);
            var template = Handlebars.templates[this.constructor.template];
            this.el.html(template(this.model));

            this.positionMeters();

            this.render();

            this.listenTo(this.model, 'change:meterCurrentValue', this.render);
        },

        positionMeters: function () {
            var meterPosition = this.options.width + this.options.spacing;

            this.el.find('.can-meter-bar').css({
                'right': (this.options.meterNumber * meterPosition) + 'px',
                'margin-bottom': (this.options.spacing + this.options.meterNumber * meterPosition) + 'px',
                'width': this.options.width + 'px'
            });
        },

        /**
         * Calculate the % of the meter which should be filled.
         * @returns {number}
         */
        getMeterFillPercentage: function () {
            var adjustment = 0 - this.model.meterMinValue;
            var scaledMeterCurrentValue = this.model.meterCurrentValue + adjustment;
            var scaledMeterMaxValue = this.model.meterMaxValue + adjustment;

            return (scaledMeterCurrentValue / scaledMeterMaxValue) * 100;
        },

        /**
         * Sets the meter fill percentage, adds a class to the meter to describe how "full"
         * it is. Class will be percent-x where x is the % full the meter is rounded down to
         * the nearest 10.
         * @returns {CanMeterView}
         */
        render: function () {
            var meterFillPercentage = this.getMeterFillPercentage();
            this.el.find('.can-meter-value').css('height', meterFillPercentage + '%');

            this.el.removeClass(function (index, css) {
                return (css.match(/\bpercent-\S+/g) || []).join(' ');
            }).addClass('percent-' + parseInt(meterFillPercentage / 10, 10) * 10);

            return this;
        }
    }, {
        template: 'canMeter'
    });

    return CanMeterView;
});
