'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var zoomerBuildDom = function zoomerBuildDom(littleImgClass) {
    var nodeInsert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';

    var $backGround = $('<div></div>').addClass('zoom__img-back');
    var $fixedImgWrap = $('<div></div>').append($backGround).addClass('zoom__img-wrap');
    $(littleImgClass).each(function (i, el) {
      $(el).attr('data-id', i); // id to every little img
      // let $imgW = $('<div></div>').addClass('zoom__img-wrap-in')
      var srcForFixed = $(el).css('background-image').replace(/^\S*zoomer\//, '').replace('")', '');
      var $item = $('<img>').addClass('zoom__img-item').attr('src', srcForFixed).attr('data-id-item', i); // id to every big img;
      // $imgW.append($item);
      $backGround.append($item);
    });
    $(nodeInsert).append($fixedImgWrap);
  };

  var Zoomer = function () {
    function Zoomer(smallImgCol) {
      _classCallCheck(this, Zoomer);

      var _this = this;
      this.oldIndex;
      this.initSmallImgWidth();
      this.smallImgCol = smallImgCol;
      this._currentFixedImgIndex;

      this.viewHeght = $(window).height();
      this.viewWidth = $(window).width();

      this.zoomImgWrapMain = document.querySelector('.zoom__img-wrap');
      this.zoomImgBack = document.querySelector('.zoom__img-back');
      this.zoomImgsAll = document.querySelectorAll('.zoom__img-item');

      this.initSizesAndPosFixedImgs()();

      $(smallImgCol).click(function () {
        _this.clickOpenZoomImg(this);
      });
      // $('.fixed-img').click(function() { _this.clickNextImg(this) });
      // $('.fixed-img-back').click(function() { _this.closeImg(this) });
      $(window).resize(function () {
        _this.onResize();
      });
    }

    _createClass(Zoomer, [{
      key: 'clickOpenZoomImg',
      value: function clickOpenZoomImg(target) {
        var id = target.getAttribute('data-id');
        var zoomImg = this.zoomImgBack.querySelector('[data-id-item="' + id + '"]');

        var zoomPos = zoomImg.getAttribute('data-point-start');

        this.zoomImgWrapMain.style.display = 'block';
        Array.prototype.forEach.call(this.zoomImgsAll, function (el, i) {
          el.style.left = 0 - zoomPos + 'px';
        });
        this.zoomImgBack.style.width = zoomImg.clientWidth - 1 + 'px';

        $('.zoom__img-wrap').animate({
          opacity: 1
        }, 400);
      }
    }, {
      key: 'onResize',
      value: function onResize() {
        this.viewHeght = $(window).height();
        this.viewWidth = $(window).width();
        if ($('.fixed-img:visible').length > 0) {
          // this.initSizeImg();
        }
        this.initSmallImgWidth();
      }
    }, {
      key: 'clickNextImg',
      value: function clickNextImg(target) {
        var sourceOfThisImg = $('.fixed-img').attr('src');
        this._currentFixedImgIndex = findImgIndex(sourceOfThisImg);
        this._lastFixedImgIndex = this.smallImgCol.length;
        var nextFixedImgIndex = void 0;
        var firstPartOfSource = sourceOfThisImg.split(this._currentFixedImgIndex)[0];
        var lastPartOfSource = sourceOfThisImg.split(this._currentFixedImgIndex)[1];

        if (this._currentFixedImgIndex === this._lastFixedImgIndex) {
          nextFixedImgIndex = 1;
        } else {
          nextFixedImgIndex = this._currentFixedImgIndex + 1;
        }

        var sourceOfNextImg = firstPartOfSource + nextFixedImgIndex + lastPartOfSource;
        $(target).css('opacity', '0').attr('src', sourceOfNextImg);
      }
    }, {
      key: 'closeImg',
      value: function closeImg(target) {
        var viewWidthNow = $(window).width();
        // $('.fixed-img-wrap').animate({ opacity: .1 }, 280).hide(0);
        if (viewWidthNow !== this.viewWidthNow) {
          this.initSmallImgWidth();
        }
      }
    }, {
      key: 'initSizeImg',
      value: function initSizeImg(zoomImg) {
        var isWrapPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var naturalHeight = $(zoomImg)[0].naturalHeight;
        var naturalWidth = $(zoomImg)[0].naturalWidth;
        $(zoomImg).css({ 'max-height': naturalHeight, 'max-width': naturalWidth }); //didn't use

        var zoomImgHeight = $(zoomImg).height();
        var zoomImgWidth = $(zoomImg).width();

        var isHeight = false;
        if (zoomImgHeight / this.viewHeght > zoomImgWidth / this.viewWidth) {
          isHeight = true;
        }

        if (isHeight) {
          $(zoomImg).css({ 'height': this.viewHeght, 'width': 'auto' });
        } else {
          $(zoomImg).css({ 'width': this.viewWidth, 'height': 'auto' });
        }

        // if (isWrapPos) { // NEW
        // this.viewWidthNow = $(window).width();
        // let zoomImgPositionTop = (this.viewHeght - $(zoomImg).height()) / 2;
        // let zoomImgPositionLeft = (this.viewWidth - $(zoomImg).width()) / 2;
        // }
        // $(zoomImg).animate({ opacity: 1 }, 300);
      }
    }, {
      key: 'initSmallImgWidth',
      value: function initSmallImgWidth() {
        $('.pane__img-outside').each(function (i, el) {
          $(el).find('.pane__img').css('height', $(el).css('padding-bottom'));
        });
      }
    }, {
      key: 'initSizesAndPosFixedImgs',
      value: function initSizesAndPosFixedImgs() {
        var _this2 = this;

        var isRecursion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return function () {
          if (!isRecursion) {
            _this2.items = Array.prototype.slice.call(document.querySelectorAll('.zoom__img-item'));
            _this2.i = 0;
            _this2.oldIndex = _this2.i;
          }
          while (_this2.i < _this2.items.length) {
            if (_this2.i !== _this2.oldIndex) {
              _this2.oldIndex = _this2.i;
              clearInterval(_this2.sizingInterval);
            }
            _this2.getRender(_this2.items[_this2.i], true);
            if (_this2.i === _this2.items.length) {
              _this2.pointStart = 0;
              _this2.giveZoomPos();
              _this2.zoomImgWrapMain.style.opacity = '0';
              _this2.zoomImgWrapMain.style.display = 'none';
            }
          }
        };
      }
    }, {
      key: 'giveZoomPos',
      value: function giveZoomPos() {
        var _this3 = this;

        $('.zoom__img-item').each(function (i, el) {
          $(el).attr('data-point-start', _this3.pointStart);
          _this3.pointStart += $(el).width();
        });
      }
    }, {
      key: 'getRender',
      value: function getRender(img, isStartInit) {
        if (img.complete) {
          if (!isStartInit) {
            clearInterval(this.isImgRendered);
          } else {
            this.i += 1;
          }
          this.initSizeImg(img);
          return;
        }
        if (isStartInit) {
          this.sizingInterval = setInterval(this.initSizesAndPosFixedImgs(true), 500);
        }
      }
    }]);

    return Zoomer;
  }();

  window.zoomerBuildDom = zoomerBuildDom;
  window.Zoomer = Zoomer;
})();

$(function () {
  zoomerBuildDom(document.querySelectorAll('.pane__img'));
  $(window).on('load', function () {
    var zoomer = new Zoomer('.pane__img');
  });
});