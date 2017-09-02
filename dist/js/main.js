'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var zoomerBuildDom = function zoomerBuildDom(littleImgClass) {
    var nodeInsert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';

    var $backGround = $('<div></div>').addClass('zoom__img-back');
    var $closeIcon = $('<span></span>').addClass('icon-close icon').append($('<span></span>').addClass('icon-close-in icon'));
    var $nextSlide = $('<div></div>').addClass('flip flip-next').append($('<span></span>').addClass('icon-next icon'));
    var $prevSlide = $('<div></div>').addClass('flip flip-prev').append($('<span></span>').addClass('icon-prev icon'));
    var $fixedImgWrap = $('<div></div>').addClass('zoom__img-wrap').append($backGround).append($closeIcon).append($nextSlide).append($prevSlide);

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

      // this.viewHeght = $(window).height();
      // this.viewWidth = $(window).width();
      this.zoomImgWrapMain = document.querySelector('.zoom__img-wrap');
      this.zoomImgBack = document.querySelector('.zoom__img-back');
      this.zoomImgsAll = document.querySelectorAll('.zoom__img-item');

      this.initSizesAndPosFixedImgs()();

      $(smallImgCol).click(function () {
        _this.clickOpenZoomImg(this);
      });
      $('.flip').click(function () {
        _this.clickNextImg(this);
      });
      $('.icon-close-in').click(function () {
        _this.closeImg(this);
      });
      $(window).resize(function () {
        _this.onResize();
      });
    }

    _createClass(Zoomer, [{
      key: 'clickNextImg',
      value: function clickNextImg(target) {
        $('.flip').css('display', 'block');

        var nextIndex = void 0;
        if (target.classList.contains('flip-next')) {
          nextIndex = this._index + 1;
        } else {
          nextIndex = this._index - 1;
        }

        var nextSlide = this.zoomImgBack.querySelector('[data-id-item="' + nextIndex + '"]');
        var zoomPos = nextSlide.getAttribute('data-point-start');

        this._index = nextIndex;
        if (nextIndex === this.zoomImgsAll.length - 1) {
          document.querySelector('.flip-next').style.display = 'none';
        } else if (nextIndex === 0) {
          document.querySelector('.flip-prev').style.display = 'none';
        }

        $('.zoom__img-item:first').animate({
          left: -zoomPos
        }, {
          duration: 400,
          queue: false,
          step: function step(now) {
            $(".zoom__img-item:gt(0)").css("left", now);
          }
        });

        $(this.zoomImgBack).animate({
          width: nextSlide.clientWidth
        }, {
          duration: 400,
          queue: false
        });
      }
    }, {
      key: 'clickOpenZoomImg',
      value: function clickOpenZoomImg(target) {
        this._index = Number(target.getAttribute('data-id'));

        if (this._index === this.zoomImgsAll.length - 1) {
          document.querySelector('.flip-next').style.display = 'none';
        } else if (this._index === 0) {
          document.querySelector('.flip-prev').style.display = 'none';
        } else {
          $('.flip').css('display', 'block');
        }

        var zoomImg = this.zoomImgBack.querySelector('[data-id-item="' + this._index + '"]');

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
      key: 'closeImg',
      value: function closeImg(target) {
        var viewWidthNow = $(window).width();
        $('.zoom__img-wrap').animate({ opacity: 0 }, 280).hide(0);
        if (viewWidthNow !== this.viewWidthNow) {
          this.initSmallImgWidth();
        }
      }
    }, {
      key: 'initSizeImg',
      value: function initSizeImg(zoomImg) {
        this.viewHeght = $(window).height();
        this.viewWidth = $(window).width();
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
      }
    }, {
      key: 'onResize',
      value: function onResize() {
        this.viewHeght = $(window).height();
        this.viewWidth = $(window).width();
        if ($('.zoom__img-wrap:visible').length > 0) {
          this.initSizesAndPosFixedImgs(false, true)();
          this.initSmallImgWidth();
          return;
        }
        this.initSmallImgWidth();
        this.initSizesAndPosFixedImgs(false, true)();
      }
    }, {
      key: 'initSizesAndPosFixedImgs',
      value: function initSizesAndPosFixedImgs(isRecursion, isUseZoomer) {
        var _this2 = this;

        return function () {
          if (!isRecursion) {
            _this2.items = Array.prototype.slice.call(document.querySelectorAll('.zoom__img-item'));
            _this2.i = 0;
            _this2.oldIndex = _this2.i;
          }

          if (!isUseZoomer) {
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
                return;
              }
            }
          }

          for (var i = 0; i < _this2.zoomImgsAll.length; i += 1) {
            _this2.initSizeImg(_this2.zoomImgsAll[i]);
            _this2.giveZoomPos();
          }
        };
      }
    }, {
      key: 'giveZoomPos',
      value: function giveZoomPos(oneEl) {
        var _this3 = this;

        if (!oneEl) {
          $('.zoom__img-item').each(function (i, el) {
            $(el).attr('data-point-start', _this3.pointStart);
            _this3.pointStart += $(el).width();
          });
          return;
        }
        $(oneEl).attr('data-point-start', this.pointStart);
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
    }, {
      key: 'initSmallImgWidth',
      value: function initSmallImgWidth() {
        $('.pane__img-outside').each(function (i, el) {
          $(el).find('.pane__img').css('height', $(el).css('padding-bottom'));
        });
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