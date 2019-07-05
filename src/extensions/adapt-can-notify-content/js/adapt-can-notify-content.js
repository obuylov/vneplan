define(['coreJS/adapt', './views/canNotifyContentView'], function (Adapt, CanNotifyContentView) {
    Adapt.on('pageView:postRender', function (view) {
        if (Adapt.course.get("_canNotifyContent")) {
            var model = view.model;

            new CanNotifyContentView({
                model: model,
                el: view.el,
                type: 'article'
            });

            new CanNotifyContentView({
                model: model,
                el: view.el,
                type: 'block'
            });

            new CanNotifyContentView({
                model: model,
                el: view.el,
                type: 'component'
            });
        }
    });
});