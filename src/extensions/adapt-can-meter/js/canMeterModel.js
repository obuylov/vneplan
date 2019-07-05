define(function (require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var CanMeter = Backbone.Model.extend({

        initialize: function (data, questionComponents) {
            this.id = data.id;
            this.meterMaxValue = data.meterMaxValue;
            this.meterMinValue = data.meterMinValue;
            this.meterStartValue = data.meterStartValue;
            this.meterCurrentValue = this.meterStartValue;
            this.name = data.name;
            this.questions = new Backbone.Collection(questionComponents);
            this._numberOfQuestionsAnswered = 0;
            this._isComplete = false;
            this._attempts = data._attempts;
            this._attemptsLeft = this._attempts;
            this._attemptsSpent = 0;
            this._resetType = data._resetType;
            this._isResetting = false;

            this.questions.on('change:_isSubmitted', this.calculateQuestionWeight, this);
        },

        /**
         * If question has been submitted, iterates through question answers, if the answer was
         * selected adds its weight to the questions totalWeight. If question has been reset sets
         * it's totalWeight to 0 and adjusts attempts. Calculates new meter value.
         * @param question
         */
        calculateQuestionWeight: function (question) {
            var totalWeight = 0;

            if (question.get('_isSubmitted')) {
                _.each(question.get('_items'), function (item) {
                    if (item._isSelected) {
                        totalWeight += item.weight;
                    }
                });
            }

            question.totalWeight = totalWeight;

            // The question was unsubmitted/retried. Adjust attempts if needed.
            if (!question.get('_isSubmitted')) {
                this.adjustAttempts();
            }

            this.calculateMeterCurrentValue();
            this.calculateNumberOfQuestionsAnswered();
        },

        /**
         * Iterates through questions in the meter, gets each questions total weight and adds them to
         * the meter start value. Ensures the meter value stays within the specified range. Renders
         * the meter.
         */
        calculateMeterCurrentValue: function () {
            var meterTotal = this.meterStartValue;

            this.questions.each(function (question) {
                if (!isNaN(question.totalWeight)) {
                    meterTotal += question.totalWeight;
                }
            });

            this.meterCurrentValue = meterTotal;

            this.setMeterCurrentValueWithinRange();

            this.set({meterCurrentValue: this.meterCurrentValue});
        },

        calculateNumberOfQuestionsAnswered: function () {
            var numberOfQuestionsAnswered = 0;

            this.questions.each(function (question) {
                if (question.get('_isSubmitted')) {
                    numberOfQuestionsAnswered++;
                }
            });

            this._numberOfQuestionsAnswered = numberOfQuestionsAnswered;

            this.checkIfComplete();
        },

        checkIfComplete: function () {
            var allQuestionsAnswered = this._numberOfQuestionsAnswered >= this.questions.length;

            if (allQuestionsAnswered) {
                this.onMeterComplete();
            } else {
                this._isComplete = false;
                this.set({_isComplete: this._isComplete});
                Adapt.trigger('can-meter:incomplete', this, this);
            }
        },

        /**
         * Checks that the meter value is within the range provided by meterMaxValue
         * and meterMinValue. If not sets it to the max/min value as appropriate.
         */
        setMeterCurrentValueWithinRange: function () {
            if (this.meterCurrentValue > this.meterMaxValue) {
                this.meterCurrentValue = this.meterMaxValue;
            }

            if (this.meterCurrentValue < this.meterMinValue) {
                this.meterCurrentValue = this.meterMinValue;
            }
        },

        /**
         * Returns false if no attempts are remaining. Otherwise updates _attemptsSpent
         * and _attemptsLeft as appropriate and returns true
         * @returns {boolean}
         */
        spendAttempt: function () {
            if (this._attemptsLeft > 0) {
                this._attemptsSpent++;

                if (this._attempts !== 'infinite') {
                    this._attemptsLeft--;
                }
            }
        },

        /**
         * Called when a question is unsubmitted. Iterates through questions, if only one question is
         * un-submitted then one attempt should be deducted from used attempts.
         */
        adjustAttempts: function () {
            if (!this._isResetting) {
                var noSubmittedQuestions = this.questions.length;

                this.questions.each(function (question) {
                    if (!question.get('_isSubmitted')) {
                        noSubmittedQuestions--;
                    }
                });

                if (this.questions.length - noSubmittedQuestions === 1) {
                    this._attemptsSpent--;

                    if (this._attempts !== 'infinite') {
                        this._attemptsLeft++;
                    }
                }
            }

            return false;
        },

        onMeterComplete: function () {
            this._isComplete = true;
            this.set({_isComplete: this._isComplete});
            this.spendAttempt();
            Adapt.trigger('can-meter:complete', this, this);
        },

        /**
         * Reset all of the questions that are related to the meter and reload the page
         */
        reset: function () {
            this._isResetting = true;

            var resetType = this._resetType;
            this.questions.each(function (question) {
                question.reset(resetType, true);
            });

            this._isResetting = false;
            Backbone.history.navigate("#/id/" + Adapt.location._currentId, {replace: true, trigger: true});
        }
    });

    return CanMeter
});