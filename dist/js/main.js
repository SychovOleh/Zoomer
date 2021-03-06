'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var mobileAndTabletcheck = function mobileAndTabletcheck() {
    //https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    var check = false;
    (function (a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  var zoomerBuildDom = function zoomerBuildDom(littleImgClass) {
    var nodeInsert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';

    var $backGroundWrap = $('<div></div>').addClass('zoom__img-back-wrap');
    var fictiveImg = $('<span></span>').addClass('fictive').appendTo($backGroundWrap);
    var $backGround = $('<div></div>').addClass('zoom__img-back').appendTo($backGroundWrap);
    var $closeIcon = $('<span></span>').addClass('icon-close icon').append($('<span></span>').addClass('icon-close-in icon'));
    var $nextSlide = $('<div></div>').addClass('flip flip-next').append($('<span></span>').addClass('icon-next icon'));
    var $prevSlide = $('<div></div>').addClass('flip flip-prev').append($('<span></span>').addClass('icon-prev icon'));
    var $fixedImgWrap = $('<section></section>').addClass('zoom__img-wrap').append($backGroundWrap).append($closeIcon).append($nextSlide).append($prevSlide);

    $(littleImgClass).each(function (i, el) {
      $(el).attr('data-id', i); // id to every little img
      var srcForFixed = $(el).css('background-image').replace(/^\S*zoomer\//, '').replace('")', '');
      var $item = $('<img>').addClass('zoom__img-item').attr('src', srcForFixed).attr('data-id-item', i); // id to every big img;
      $backGround.append($item);
    });
    document.querySelector('body').appendChild($fixedImgWrap[0]);
  };

  var swipedetect = function swipedetect(el, callback) {
    //www.javascriptkit.com/javatutors/touchevents2.shtml
    var touchsurface = el,
        swipedir = void 0,
        startX = void 0,
        startY = void 0,
        distX = void 0,
        distY = void 0,
        threshold = 150,
        //required min distance traveled to be considered swipe
    restraint = 100,
        // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300,
        // maximum time allowed to travel that distance
    elapsedTime = void 0,
        startTime = void 0,
        handleswipe = callback || function (swipedir) {};
    touchsurface.addEventListener('touchstart', function (e) {
      var touchobj = e.changedTouches[0];
      swipedir = 'none';
      dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime(); // record time when finger first makes contact with surface
      e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchmove', function (e) {
      e.preventDefault(); // prevent scrolling when inside DIV
    }, false);

    touchsurface.addEventListener('touchend', function (e) {
      var touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      if (elapsedTime <= allowedTime) {
        // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          // 2nd condition for horizontal swipe met
          swipedir = distX < 0 ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
          // 2nd condition for vertical swipe met
          swipedir = distY < 0 ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    }, false);
  };

  // return swipedetect(this.zoomImgWrapMain, function(swipedir) {
  //   // swipedir contains either "none", "left", "right", "top", or "down"
  //   return swipedir
  // })

  var scroll = {
    disableScroll: function disableScroll() {
      if ($(document).height() > $(window).height()) {
        var scrollTop = $('html').scrollTop() ? $('html').scrollTop() : $('body').scrollTop();
        $('html').addClass('noscroll').css('top', -scrollTop);
      }
    },
    enableScroll: function enableScroll() {
      var scrollTop = parseInt($('html').css('top'), 10);
      $('html').removeClass('noscroll');
      $('html,body').scrollTop(-scrollTop);
    }
  };

  var Zoomer = function () {
    function Zoomer(smallImgCol) {
      _classCallCheck(this, Zoomer);

      var _this = this;
      this.oldIndex;
      this.initSmallImgWidth();
      this.smallImgCol = smallImgCol;
      this._currentFixedImgIndex;
      this.isSlideLeafing = false;

      this.zoomImgWrapMain = document.querySelector('.zoom__img-wrap');
      this.zoomImgBack = document.querySelector('.zoom__img-back');
      this.zoomImgsAll = document.querySelectorAll('.zoom__img-item');
      this.prevSlide = this.zoomImgWrapMain.querySelector('.fictive');

      this.initSizesAndPosFixedImgs()();

      $(smallImgCol).click(function () {
        _this.clickOpenZoomImg(this);
      });
      $('.icon-close-in').click(function () {
        _this.closeImg(this);
      });
      $(window).resize(function () {
        _this.onResize();
      });
      if (!mobileAndTabletcheck()) {
        $('.flip').click(function () {
          _this.clickNextImg(this);
        });
      } else {
        swipedetect(this.zoomImgWrapMain, this.clickNextImg());
      }
    }

    _createClass(Zoomer, [{
      key: 'clickNextImg',
      value: function clickNextImg(target) {
        this.isPrevSlideRendered();

        if (!mobileAndTabletcheck()) {
          $('.flip').css('display', 'block');
        }

        this.nextIndex;
        var isNextSlide = false;

        if (!mobileAndTabletcheck()) {
          if (target.classList.contains('flip-next')) {
            this.nextIndex = this._index + 1;
            isNextSlide = true;
          } else {
            this.nextIndex = this._index - 1;
          }
        } else if (swipedir === 'left') {
          this.nextIndex = this._index + 1;
          isNextSlide = true;
        } else if (swipedir === 'right') {
          this.nextIndex = this._index - 1;
        }

        this.curSlide = this.zoomImgBack.querySelector('[data-id-item="' + this._index + '"]');
        this.nextSlide = this.zoomImgBack.querySelector('[data-id-item="' + this.nextIndex + '"]');

        this.isSlideLeafing = true;
        this.initSizeImg(this.nextSlide);

        this._index = this.nextIndex;

        if (!mobileAndTabletcheck()) {
          if (this.nextIndex === this.zoomImgsAll.length - 1) {
            document.querySelector('.flip-next').style.display = 'none';
          } else if (this.nextIndex === 0) {
            document.querySelector('.flip-prev').style.display = 'none';
          }
        }

        this.curSlide.style.zIndex = '4';
        this.nextSlide.style.display = 'block';

        this.initSizeImg(this.curSlide);

        this.prevSlide = this.curSlide;

        if (isNextSlide) {
          this.goNextSlide();
          return;
        }
        this.goPrevSlide();
      }
    }, {
      key: 'onResize',
      value: function onResize() {
        this.i = 0;
        this.viewHeght = $(window).height();
        this.viewWidth = $(window).width();

        if (this.isZoomerVisible) {
          if (this.isSlideLeafing) {
            this.initSizeImg(this.nextSlide);
          } else {
            this.initSizeImg(this.curSlide);
          }
        } else {
          this.initSmallImgWidth();
        }
      }
    }, {
      key: 'initSizeImg',
      value: function initSizeImg(zoomImg, isInitDom) {
        if (isInitDom) {
          var naturalHeight = $(zoomImg)[0].naturalHeight;
          var naturalWidth = $(zoomImg)[0].naturalWidth;
          $(zoomImg).css({ 'max-height': naturalHeight, 'max-width': naturalWidth });
        }

        this.viewHeght = $(window).height();
        this.viewWidth = $(window).width();

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

        if (!isInitDom && this.isZoomerVisible) {
          this.zoomImgBack.style.width = zoomImg.clientWidth - 1 + 'px';
        }
      }
    }, {
      key: 'getRender',
      value: function getRender(img, isStartInit) {
        if (img.complete) {
          this.i += 1;
          this.initSizeImg(img, true);
          return;
        }
        if (isStartInit) {
          this.sizingInterval = setInterval(this.initSizesAndPosFixedImgs(), 500);
        }
      }
    }, {
      key: 'initSizesAndPosFixedImgs',
      value: function initSizesAndPosFixedImgs() {
        var _this2 = this;

        return function () {
          _this2.items = Array.prototype.slice.call(document.querySelectorAll('.zoom__img-item'));
          _this2.i = 0;
          _this2.oldIndex = _this2.i;

          while (_this2.i < _this2.items.length) {
            if (_this2.i !== _this2.oldIndex) {
              _this2.oldIndex = _this2.i;
              clearInterval(_this2.sizingInterval);
            }

            _this2.getRender(_this2.items[_this2.i], true);
          }
        };
      }
    }, {
      key: 'clickOpenZoomImg',
      value: function clickOpenZoomImg(target) {
        scroll.disableScroll();
        this._index = Number(target.getAttribute('data-id'));

        for (var i = 0; i < this.zoomImgsAll.length; i += 1) {
          if (this.zoomImgsAll[i].style.display !== 'none' || !this.zoomImgsAll[i].style.display) {
            this.zoomImgsAll[i].style.display = 'none';
          }
          if (this.zoomImgsAll[i].style.left !== '0') {
            this.zoomImgsAll[i].style.left = '0';
          }
        }

        if (!mobileAndTabletcheck()) {
          if (this._index === this.zoomImgsAll.length - 1) {
            //is Flip hide
            document.querySelector('.flip-next').style.display = 'none';
            document.querySelector('.flip-prev').style.display = 'block';
          } else if (this._index === 0) {
            document.querySelector('.flip-prev').style.display = 'none';
            document.querySelector('.flip-next').style.display = 'block';
          } else {
            $('.flip').css('display', 'block');
          }
        } else {
          $('.flip').css('display', 'none');
        }

        this.curSlide = this.zoomImgBack.querySelector('[data-id-item="' + this._index + '"]');

        this.curSlide.style.display = 'block';
        this.curSlide.style.opacity = '1';
        this.zoomImgWrapMain.style.display = 'flex';

        this.initSizeImg(this.curSlide);

        $('.zoom__img-wrap').animate({
          opacity: 1
        }, 150);

        this.viewWidthWhenOpen = $(window).width();
        this.viewHeightWhenOpen = $(window).height();

        this.prevSlide = this.zoomImgWrapMain.querySelector('.fictive');
      }
    }, {
      key: 'isPrevSlideRendered',
      value: function isPrevSlideRendered() {
        if (this.prevSlide.style.display === 'block') {
          this.prevSlide.style.display = 'none';
        }
        if (this.prevSlide.style.zIndex !== '3') {
          this.prevSlide.style.zIndex = '3';
        }
        if (this.prevSlide.style.left !== '0') {
          this.prevSlide.style.left = '0';
        }
      }
    }, {
      key: 'goNextSlide',
      value: function goNextSlide() {
        var _this3 = this;

        var newWidth = this.nextSlide.clientWidth;
        this.nextSlide.style.left = -newWidth;

        $(this.curSlide).finish().animate({ left: -newWidth }, {
          duration: 150,
          start: function start() {
            $(_this3.zoomImgBack).finish().animate({
              width: newWidth
            }, {
              duration: 150,
              always: function always() {
                $(_this3.curSlide).css('display', 'none').animate({
                  left: 0,
                  zIndex: 3
                }, {
                  duration: 0
                });
                $(_this3.nextSlide).animate({
                  left: 0
                }, 0);
              }
            });
          }
        });
      }
    }, {
      key: 'goPrevSlide',
      value: function goPrevSlide() {
        var _this4 = this;

        var newWidth = this.nextSlide.clientWidth;
        this.nextSlide.style.left = newWidth;

        $(this.curSlide).finish().animate({ left: newWidth }, {
          duration: 150,
          start: function start() {
            $(_this4.zoomImgBack).finish().animate({
              width: newWidth
            }, {
              duration: 150,
              always: function always() {
                $(_this4.curSlide).css('display', 'none').animate({
                  left: 0,
                  zIndex: 3
                }, {
                  duration: 0
                });
                $(_this4.nextSlide).animate({
                  left: 0
                }, 0);
              }
            });
          }
        });
      }
    }, {
      key: 'closeImg',
      value: function closeImg() {
        var viewWidthNow = $(window).width();
        var viewHeighthNow = $(window).height();
        if (viewWidthNow !== this.viewWidthWhenOpen || viewHeighthNow !== this.viewHeightWhenOpen) {
          this.initSmallImgWidth();
        }

        $('.zoom__img-wrap').animate({ opacity: 0 }, 150, false).hide(0);

        this.isPrevSlideRendered();
        this.isSlideLeafing = false;
        scroll.enableScroll();
      }
    }, {
      key: 'initSmallImgWidth',
      value: function initSmallImgWidth() {
        $('.pane__img-outside').each(function (i, el) {
          $(el).find('.pane__img').css('height', $(el).css('padding-bottom'));
        });
      }
    }, {
      key: 'isZoomerVisible',
      get: function get() {
        return $('.zoom__img-wrap:visible').length > 0;
      }
    }]);

    return Zoomer;
  }();

  window.mobileAndTabletcheck = mobileAndTabletcheck;
  window.zoomerBuildDom = zoomerBuildDom;
  window.Zoomer = Zoomer;
  window.swipedetect = swipedetect;
})();

$(function () {
  zoomerBuildDom(document.querySelectorAll('.pane__img'));
  $(window).on('load', function () {
    var zoomer = new Zoomer('.pane__img');
    window.zoomer = zoomer;

    //Preloader
    $('body').addClass('loaded');
  });
});