define([
    'coreJS/adapt',
    './views/canBackgroundView'
], function (Adapt, CanBackgroundView) {

    Adapt.on("pageView:postRender", function (view) {
        var model = view.model;
        if (Adapt.course.get("_canBackground")) {
            new CanBackgroundView({
                model: model,
                el: view.el,
                type: 'contentObject'
            });

            new CanBackgroundView({
                model: model,
                el: view.el,
                type: 'article'
            });

            new CanBackgroundView({
                model: model,
                el: view.el,
                type: 'block'
            });

            new CanBackgroundView({
                model: model,
                el: view.el,
                type: 'component'
            });
        }
    });
});
