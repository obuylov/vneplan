define([
    'coreJS/adapt'
], function (Adapt) {

    var CanBackgroundView = Backbone.View.extend({
        _models: null,
        _modelsIndexed: null,
        $backgroundContainer: null,
        $backgrounds: null,
        $elements: null,

        initialize: function (options) {
            this.options = options;

            if (this.options.type === 'contentObject') {
                this._models = [this.model];
            } else {
                this._models = this.model.findDescendants(this.options.type + 's').filter(function (model) {
                    return model.get("_canBackground");
                });
            }

            if (this._models.length === 0) {
                return;
            }

            this._modelsIndexed = _.indexBy(this._models, "_id");

            this.listenTo(Adapt, "pageView:ready", this.onPageReady);
            //Is this the best way to swap out graphics - maybe best to add both graphics on load and then toggle classes on device:changed, device:resize?
            this.listenTo(Adapt, 'device:changed', this.onPageReady);
            this.listenTo(Adapt, 'device:resize', this.onPageReady);
        },

        onPageReady: function () {
            for (var i = 0, l = this._models.length; i < l; i++) {
                var model = this._models[i];

                if (!model.get('_canBackground')) continue;

                var id = model.get("_id");
                var options = model.get('_canBackground');
                var $element = this.$el.find("." + id);

                if (this.options.type === 'contentObject') {
                    $element = this.$el.find('.page-header');
                }

                if (model.get('_canBackground').src !== '' || model.get('_canBackground').backgroundColor !== '') {
                    //Initially set the background graphic and height - this will be called on window resize and device
                    this.setBackgroundGraphic($element, options);
                }

                if (model.get('_canBackground').transparentChildren) {
                    $element.addClass('transparent-children');
                }
            }
        },

        setBackgroundGraphic: function ($element, options) {
            var image_src = options.src;
            var banner_height = options.bannerHeight;

            if (Adapt.device.screenSize === 'large') {
                $element.addClass('can-background-' + this.options.type).remove('can-background-' + this.options.type + '-mobile');
            } else {
                $element.addClass('can-background-' + this.options.type + '-mobile').remove('can-background-' + this.options.type);
                image_src = options.mobileSrc;
                banner_height = options.mobileBannerHeight;
            }

            // See https://canstudios.myjetbrains.com/youtrack/issue/AAT-663
            // This should be removed in future when all users are on 0.4.1 of the authoring tool
            if (image_src.indexOf('course/assets') !== -1) {
                image_src = image_src.replace('course/assets', 'course/' + Adapt.config.get('_defaultLanguage') + '/assets');
            }

            $element.css({
                'background-color': options.backgroundColor,
                'background-attachment': options.backgroundAttachement,
                'background-repeat': options.backgroundRepeat,
                'background-size': options.backgroundSize,
                'background-position': options.backgroundPosition,
                'background-image': 'url(' + image_src + ')',
                'min-height': banner_height + 'px'
            });
        }
    });

    return CanBackgroundView;
});
