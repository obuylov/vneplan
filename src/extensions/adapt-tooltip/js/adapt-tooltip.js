/*
 * adapt-tooltip
 * License -
 */
define(function (require) {
  var Adapt = require('core/js/adapt');
  var CONFIG = require('./conf');
  var $tooltip = null;
  var $targetEle = null;

  function setUptoolTip() {
    window.tooltip = onclick;
  }

  var onclick = function (evt) {
    $('.tooltip-window').remove();
    $tooltip = $('<div class="tooltip-window"></div>');
    $targetEle = $(this);
    var tip = $targetEle.attr('data-title');
    if (!tip || tip == '') return false;
    //var lazyLayout = _.debounce(showTooltip, 200);
    $tooltip.css('opacity', 0).html(tip).appendTo('body');
    showTooltip();

      setTimeout(function() {
          $('body').on('click', removeTooltip);
      }, 500);

    // setTimeout(() => {$('body').on('click', removeTooltip); }, 500);
    // $(window).resize(_.bind(lazyLayout, this));
  };

  function showTooltip() {
    if (!$tooltip || !$targetEle) return;
    setUptoolTipWidth();
    var targetEleLeft = $targetEle.offset().left;
    var targetEleTop = $targetEle.offset().top;
    var targetEleWidth = $targetEle.outerWidth();

    var tooltipWidth = $tooltip.outerWidth();
    var tooltipHeight = $tooltip.outerHeight();

    var posLeft = targetEleLeft + (targetEleWidth / 2) - (tooltipWidth / 2);
    var posTop = targetEleTop - tooltipHeight - CONFIG.POSIONFROMTEXT;

    if (posLeft < 0) {
      posLeft = targetEleLeft + targetEleWidth / 2 - CONFIG.POSIONFROMTEXT;
      $tooltip.addClass('left');
    } else {
      $tooltip.removeClass('left');
    }

    if (posLeft + tooltipWidth > $(window).width()) {
      posLeft = targetEleLeft - tooltipWidth + targetEleWidth / 2 + CONFIG.POSIONFROMTEXT;
      $tooltip.addClass('right');
    } else {
      $tooltip.removeClass('right');
    }

    if (posTop < 0) {
      var posTop = targetEleTop + targetEleTop;
      $tooltip.addClass('top');
    } else {
      $tooltip.removeClass('top');
    }

    $tooltip.css({
      left: posLeft,
      top: posTop
    }).animate({
      top: '+=' + CONFIG.ANIMATE_TOP,
      opacity: 1
    }, CONFIG.DURATION, CONFIG.EASING);

  }

  function setUptoolTipWidth() {
    if ($(window).width() < $tooltip.outerWidth() * CONFIG.PADDINGFACTOR) {
      $tooltip.css('max-width', $(window).width() / 2);
    } else {
      $tooltip.css('max-width', CONFIG.MAX_WIDTH);
    }
  }

  function removeTooltip() {
    $('.tooltip-window').remove();
    $('body').off('click', removeTooltip);
  }

  Adapt.on("app:dataReady", function () {
    var tooltip = Adapt.course.get('_tooltip');
    if (tooltip && tooltip._isEnabled) {
      setUptoolTip();
    }
  });

  Adapt.on("pageView:ready", function () {
    $('.tooltip-window').remove();
    $('span[data-rel=tooltip]').on('click', function () {
      tooltip.call(this)
    });
  });

  Adapt.on('menuView:postRender', function () {
    $('.tooltip-window').remove();
  })
});