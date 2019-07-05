define([
    'backbone',
    'coreJS/adapt',
    './adapt-pinchZoomerContainerView'
], function (Backbone, Adapt, pinchZoomerContainerView) {

    var pinchZoomerCourseData;
    var pinchZoomerComponentData;

    function onComponentViewPostRender(componentView) {

        pinchZoomerComponentData = componentView.model.get('_pinchZoomer') || {};
        if (pinchZoomerComponentData._isEnabled !== true) return;


        if (Adapt.device.screenSize === "small") {
            changeInstructionForTouchDevices(componentView);

            // pinchZoomerComponentData = _.extend(_.clone(pinchZoomerCourseData), pinchZoomerComponentData);
            switch (componentView.model.get('_component')) {

                case 'accordion':
                    _.each(componentView.model.get('_items'), function (item, index) {
                        if (item._pinchZoomer) {
                            _.extend(pinchZoomerComponentData, item._pinchZoomer);
                            var $pinchZoomerView = new pinchZoomerContainerView({model: new Backbone.Model(pinchZoomerCourseData)}).$el;
                            componentView.$('.accordion-item-graphic').eq(index).wrap($pinchZoomerView);
                        }
                    });
                    break;

                case 'graphic':
                default:
                    var $pinchZoomerView = new pinchZoomerContainerView({model: new Backbone.Model(pinchZoomerComponentData)}).$el;
                    var $componentBody = componentView.$el.find('.component-widget');
                    $componentBody.wrap($pinchZoomerView);
            }
        }
    }

    function changeInstructionForTouchDevices(componentView) {
        var instruction = componentView.$el.find('.component-instruction-inner');
        instruction.html(pinchZoomerComponentData._mobileInstructionText);
    }

    Adapt.on("componentView:postRender", function (pinchZoomerComponentView) {
        var courseData = Adapt.course.get('_pinchZoomer');
        if (courseData && courseData._isEnabled) {
            onComponentViewPostRender(pinchZoomerComponentView);
        }
    });

});

