define([
    'coreJS/adapt'
], function (Adapt) {

    var CanNotifyView = Backbone.View.extend({
        _models: null,
        _notifyModels: [],

        events: {
            'click .can-notify-content': 'showNotify'
        },

        /**
         * Build an array with the following format which can be used to retrieve title
         * and body to be displayed on click.
         * [contentId: [ notifyId: [title, body], ...], ...]
         * @param options
         */
        initialize: function (options) {
            var self = this;
            this.options = options;

            this._models = this.model.findDescendants(this.options.type + 's').filter(function (model) {
                return model.get("_canNotifyContent");
            });

            for (var i = 0, l = this._models.length; i < l; i++) {
                var model = this._models[i];

                if (!model.get('_canNotifyContent')) continue;

                var id = model.get("_id");
                var options = model.get('_canNotifyContent');

                if (!(id in this._notifyModels)) {
                    this._notifyModels[id] = []
                }

                options._items.forEach(function (item) {
                    self._notifyModels[id][item._id] = {title: item.title, body: item.body};
                });
            }
        },

        showNotify: function (e) {
            e.preventDefault();
            var element = $(e.currentTarget);
            var contentId = element.closest("." + this.options.type).data('adapt-id');
            var notifyId = element.data('can-notify-content-id');

            if (typeof this._notifyModels[contentId] === 'undefined' || typeof this._notifyModels[contentId][notifyId] === 'undefined') {
                return;
            }

            var popupObject = {
                title: this._notifyModels[contentId][notifyId].title,
                body: this._notifyModels[contentId][notifyId].body
            };

            if (Adapt.config.get('_accessibility') && Adapt.config.get('_accessibility')._isActive) {
                $('.loading').show();
                $('#a11y-focuser').focus();
                $('body').attr('aria-hidden', true);
                _.delay(function () {
                    $('.loading').hide();
                    $('body').removeAttr('aria-hidden');
                    Adapt.trigger('notify:popup', popupObject);
                }, 3000);
            } else {
                Adapt.trigger('notify:popup', popupObject);
            }
        }
    });

    return CanNotifyView;
});