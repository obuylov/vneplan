define(function (require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');
    var CanMeterModel = require('./canMeterModel');
    var CanMeterView = require('./canMeterView');

    var canMeterCollection = new Backbone.Collection();

    /**
     * Resets all of the meter mcqs associated with the given meter
     */
    Adapt.on('can-meter:reset', function (meterId) {
        var meterModel = canMeterCollection.findWhere({id: meterId});
        meterModel.reset();
    });

    /**
     * Takes a collection of the meters and a page id and creates a meter view for each meter that is
     * set to be displayed on the page with given id. Sets the height of the meter container as appropriate.
     */
    function createMeterViews(pageId) {
        var counter = 0;
        var meterWidth = 20;
        var meterSpacing = 8;

        canMeterCollection.each(function (model) {
            if (model.get('_pageIds').includes(pageId)) {
                new CanMeterView({
                    model: model,
                    meterNumber: counter,
                    width: meterWidth,
                    spacing: meterSpacing
                });

                counter++;
            }
        });

        if (!$('html').hasClass('size-large')) {
            // 12 is added here to ensure there is spacing above and below meters on mobile view
            var canMeterContainerHeight = 12 + counter * (meterWidth + meterSpacing);
            $('.can-meter-container').css('height', canMeterContainerHeight + 'px');
            $('.page').css('padding-bottom', canMeterContainerHeight + 'px');
        }
    }

    function removeMeterViews() {
        $('.can-meter-container').empty();
    }

    /**
     * Iterates through components on the course. Gets all 'can-meter-mcq'
     * components and sorts them into an associative object.
     * { meterId: [questions] }
     * @returns {{}}
     */
    function getComponentsByMeter() {
        var meterComponents = {};

        _.each(Adapt.components.models, function (component) {
            if (component.get('_component') === 'can-meter-mcq') {
                var componentMeter = component.get('_meterId');

                if (componentMeter in meterComponents) {
                    meterComponents[componentMeter].push(component);
                } else {
                    meterComponents[componentMeter] = [component];
                }
            }
        });

        return meterComponents;
    }

    /**
     * Iterate through meters that have been set in the extension. For each meter
     * create a CanMeterModel that contains the meter information and the questions
     * associated with the meter.
     * @param canMeterItems
     */
    function setCanMeterCollection(canMeterItems) {
        canMeterCollection = new Backbone.Collection();
        var meterComponents = getComponentsByMeter();

        _.each(canMeterItems, function (canMeter) {
            canMeterCollection.add(new CanMeterModel(canMeter, meterComponents[canMeter.id]));

            if (typeof meterComponents[canMeter.id] === 'undefined') {
                Adapt.log.warn('Warning: ' + canMeter.name + ' does not have any corresponding Meter Multiple Choice Question components');
            }
        });
    }

    function initCanMeter() {
        var canMeter = Adapt.course.get('_canMeter');

        //do not proceed unless can meter is enabled on course.json
        if (!canMeter || !canMeter._isEnabled) {
            return;
        }

        setCanMeterCollection(canMeter._meterItems);

        //Set this so that the can-meter-results component can easily access models by meter id
        canMeter['models'] = canMeterCollection;

        $('#wrapper').prepend('<div class="can-meter-container"></div>');

        Adapt.on('pageView:ready', function () {
            removeMeterViews();
            createMeterViews($('.page').data('adapt-id'));
        });

        Adapt.on('menuView:ready', function () {
            removeMeterViews();
        });
    }

    Adapt.once('app:dataReady', function () {
        initCanMeter();
    });

});
