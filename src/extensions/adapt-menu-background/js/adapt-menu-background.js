define(["coreJS/adapt"], function (Adapt) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var menuBackground = Backbone.View.extend({

        className: "extension",

        initialize: function () {
        }
    });

    Adapt.on("pageView:ready", function () {
        if (!Adapt.course.get('_menuBackground')) return;
        if (Adapt.course.get('_menuBackground')._menuHeader._applyToPage || !(Adapt.course.get('_menuBackground')._menuHeader._link === "")) {
            $('.page-header').css('background', 'url(' + Adapt.course.get('_menuBackground')._menuHeader._link + ')');
            $('.page-header').css('background-size', 'cover');
        }
    });
    Adapt.on("menuView:ready", function () {
        if (!Adapt.course.get('_menuBackground')) return;
        if (!(Adapt.course.get('_menuBackground')._menuHeader._link === "")) {
            $('.menu-header').css('background', 'url(' + Adapt.course.get('_menuBackground')._menuHeader._link + ')');
            $('.menu-header').css('background-size', 'cover');
        }
        if (!(Adapt.course.get('_menuBackground')._backgroundLink === "")) {
            $('.menu-container-inner').css('background', 'url(' + Adapt.course.get('_menuBackground')._backgroundLink + ')');
            $('.menu-container-inner').css('padding-bottom', '22%');
            $('.menu-container-inner').css('background-size', 'cover');
            $('.menu-container-inner').css('background-position-y', '300px');
        }
    });

    return menuBackground;
});
