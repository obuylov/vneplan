define(function (require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var DoubleAccordion = ComponentView.extend({

        events: {
            'click .item-title': 'toggleItem',
            'click .child-item-title': 'toggleChildItem'
        },

        preRender: function () {
            // Checks to see if the accordion should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function () {
            this.setReadyStatus();
        },

        // Used to check if the accordion should reset on revisit
        checkIfResetOnRevisit: function () {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }

            _.each(this.model.get('_items'), function (item) {
                _.filter(item._child, function (child) {
                    child._isVisited = false;
                });
                item._isVisited = false;
            });
        },

        toggleItem: function (event) {
            event.preventDefault();
            this.$('.item-body').stop(true, true).slideUp(400);

            if (!$(event.currentTarget).hasClass('selected')) { // this function extends 
                this.$('.item-title').removeClass('selected');
                if (!this.hasChild($(event.currentTarget).parent('.item').index())) {
                    $(event.currentTarget).addClass('visited');
                }

                var body = $(event.currentTarget).addClass('selected').siblings('.item-body').slideToggle(200, function () {
                    if (event.currentTarget) {
                        $(body).a11y_focus();
                    }
                });

                this.$('.item-title-icon').removeClass('icon-minus').addClass('icon-plus');
                $('.item-title-icon', event.currentTarget).removeClass('icon-plus').addClass('icon-minus');

                if ($(event.currentTarget).hasClass('item')) {
                    this.setVisited($(event.currentTarget).index());
                } else {
                    this.setVisited($(event.currentTarget).parent('.item').index());
                }
            } else {
                this.$('.item-title').removeClass('selected');
                $(event.currentTarget).removeClass('selected');
                $('.item-title-icon', event.currentTarget).removeClass('icon-minus').addClass('icon-plus');
            }
            // set aria-expanded value
            if ($(event.currentTarget).hasClass('selected')) {
                $('.item-title').attr('aria-expanded', false);
                $(event.currentTarget).attr('aria-expanded', true);
            } else {
                $(event.currentTarget).attr('aria-expanded', false);
            }
        },

        toggleChildItem: function (event) {
            event.preventDefault();
            this.$('.child-item-body').stop(true, true).slideUp(200);

            if (!$(event.currentTarget).hasClass('selected')) {
                this.$('.child-item-title').removeClass('selected');
                var body = $(event.currentTarget).addClass('selected visited').siblings('.child-item-body').slideToggle(200, function () {
                    $(body).a11y_focus();
                });
                this.$('.child-item-title-icon').removeClass('icon-minus').addClass('icon-plus');
                $('.child-item-title-icon', event.currentTarget).removeClass('icon-plus').addClass('icon-minus');

                if ($(event.currentTarget).hasClass('child-item')) {
                    this.setVisitedChild($(event.currentTarget).index());
                } else {
                    if (
                        this.setVisitedChild($(event.currentTarget).parentsUntil('.item').parent().index(), $(event.currentTarget).parent('.child-item').index())) {
                        $(event.currentTarget).parentsUntil('item-body').prev().addClass('visited');
                    }
                }
            } else {
                this.$('.child-item-title').removeClass('selected');
                $(event.currentTarget).removeClass('selected');
                $('.child-item-title-icon', event.currentTarget).removeClass('icon-minus').addClass('icon-plus');
            }
            // set aria-expanded value
            if ($(event.currentTarget).hasClass('selected')) {
                $('.item-title').attr('aria-expanded', false);
                $(event.currentTarget).attr('aria-expanded', true);
            } else {
                $(event.currentTarget).attr('aria-expanded', false);
            }
        },

        setVisited: function (index) {
            var item = this.model.get('_items')[index];
            if (!item.hasOwnProperty('_child')) {
                item._isVisited = true;
            }
            this.checkCompletionStatus();
        },

        hasChild: function (index) {
            var item = this.model.get('_items')[index];
            if (item.hasOwnProperty('_child')) {
                return true;
            }
            return false;
        },

        setVisitedChild: function (index, childIndex) {
            var item = this.model.get('_items')[index];
            var child = item._child[childIndex];
            child._isVisited = true;
            item._isVisited = this.checkCompletedItem(item);
            this.checkCompletionStatus();
            return item._isVisited;
        },

        getVisitedItems: function () {
            return _.filter(this.model.get('_items'), function (item) {
                return item._isVisited;
            });
        },

        checkCompletedItem: function (item) {
            var isComplete = true;
            _.filter(item._child, function (child) {
                if (child._isVisited == false) {
                    isComplete = false;
                }
            });
            return isComplete;
        },

        checkCompletionStatus: function () {
            if (this.getVisitedItems().length == this.model.get('_items').length) {
                this.setCompletionStatus();
            }
        }
    });

    Adapt.register('doubleaccordion', DoubleAccordion);

    return DoubleAccordion;
});
