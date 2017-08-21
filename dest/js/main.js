'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var findImgIndex = function findImgIndex(inputLink) {
    var linkToArr = inputLink.split('/');
    return Number(linkToArr[linkToArr.length - 1].replace('.jpg', ''));
  };

  var Zoomer = function () {
    function Zoomer(smallImgCol) {
      var fixedImgFolderName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fixed_img';
      var nodeInsert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';

      _classCallCheck(this, Zoomer);

      this.fixedImgFolderName = fixedImgFolderName;
      this.nodeInsert = nodeInsert;
      this._buildZoomerDom = this.buildDom();
      this.smallImgCol = smallImgCol;

      this._currentFixedImgIndex;

      var _this = this;
      $(smallImgCol).click(function () {
        _this.clickOpenFixedImg(this);
      });
      $('.fixed-img').click(function () {
        _this.clickNextImg(this);
      });
      $('.fixed-img-back').click(function () {
        _this.closeImg(this);
      });
      $(window).resize(function () {
        _this.resizeFixedImg();
      });
    }

    _createClass(Zoomer, [{
      key: 'initPosition',
      value: function initPosition() {
        var naturalHeight = $(this.$img)[0].naturalHeight;
        var naturalWidth = $(this.$img)[0].naturalWidth;
        $(this.$img).css({ 'max-height': naturalHeight, 'max-width': naturalWidth });

        var viewHeght = $(window).height();
        var viewWidth = $(window).width();
        var fixedImgHeight = $(this.$img).height();
        var fixedImgWidth = $(this.$img).width();

        var isHeight = false;
        if (fixedImgHeight / viewHeght > fixedImgWidth / viewWidth) {
          isHeight = true;
        }

        if (isHeight) {
          $(this.$img).css({ 'max-height': viewHeght * .86, 'width': 'auto' });
        } else {
          $(this.$img).css({ 'max-width': viewWidth * .86, 'height': 'auto' });
        }
        // debugger
        var fixedImgHorisontBorders = Number($(this.$img).css('border-right-width').replace('px', '')) + Number($(this.$img).css('border-left-width').replace('px', ''));
        var fixedImgVerticalBorders = Number($(this.$img).css('border-top-width').replace('px', '')) + Number($(this.$img).css('border-bottom-width').replace('px', ''));

        var fixedImgPositionTop = (viewHeght - ($(this.$img).height() + fixedImgVerticalBorders)) / 2;
        var fixedImgPositionLeft = (viewWidth - ($(this.$img).width() + fixedImgHorisontBorders)) / 2;
        $('.fixed-img-wrap').css({ 'top': fixedImgPositionTop, 'left': fixedImgPositionLeft });

        $(this.$img).animate({ opacity: 1 }, 300);
      }
    }, {
      key: 'getRender',
      value: function getRender() {
        var _this2 = this;

        return function () {
          if (_this2.$img[0].complete) {
            clearInterval(_this2.isImgRendered);
            _this2.initPosition();
          }
        };
      }
    }, {
      key: 'clickOpenFixedImg',
      value: function clickOpenFixedImg(target) {
        $('.fixed-img-wrap').css('opacity', '1').show(0);
        var smallImgLink = $(target).attr('src');

        this.fixedImgLink = smallImgLink.replace('150px', this.fixedImgFolderName);

        $(this.$img).css('opacity', '0').attr('src', this.fixedImgLink);
        this.isImgRendered = setInterval(this.getRender(), 0);
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

        this.isImgRendered = setInterval(this.getRender(), 0);
      }
    }, {
      key: 'closeImg',
      value: function closeImg(target) {
        $('.fixed-img-wrap').animate({ opacity: .1 }, 280).hide(0);
      }
    }, {
      key: 'resizeFixedImg',
      value: function resizeFixedImg() {
        if ($('.fixed-img:visible').length > 0) {
          this.initPosition();
        }
      }
    }, {
      key: 'buildDom',
      value: function buildDom() {
        this.$img = $('<img></img>').addClass('fixed-img');
        this.$backGround = $('<span></span>').addClass('fixed-img-back');
        var fixedImgWrap = $('<span></span>').css({ 'position': 'fixed', 'z-index': '1000' }).append(this.$backGround).append(this.$img).addClass('fixed-img-wrap');
        $(this.nodeInsert).append(fixedImgWrap.get());
      }
    }]);

    return Zoomer;
  }();

  window.Zoomer = Zoomer;
})();

$(function () {
  var zoomer = new Zoomer($('.pane__img').get());
});