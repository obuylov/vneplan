define([
    'backbone',
    'coreJS/adapt',
    'extensions/adapt-pinchZoomer/js/jquery.zoom'
], function (Backbone, Adapt, zoom) {

    var pinchZoomerContainerView = Backbone.View.extend({

        className: 'pinchZoomerContainer',

        events: {
            'click .pinchZoomer': 'activatePinchZoomer'
        },

        initialize: function (options) {
            this.listenTo(Adapt, 'remove', this.remove);
            this.render();
        },


        activatePinchZoomer: function (event) {

            var $currentTarget = $(event.currentTarget);
            $currentTarget.find('.zoomImg').remove();
            //var targetImage=this.model.get('src');
            $currentTarget.zoom(); // add { targetImage } if you want to magnify other 

        },

        render: function () {
            var data = this.model.toJSON();
            var template = Handlebars.templates["pinchZoomer"];
            this.$el.html(template(data));
            return this;
        }

    });
    return pinchZoomerContainerView;
});
