(function() {
  const zoomerBuildDom = (littleImgClass, nodeInsert = 'body') => {
    let $backGround = $('<div></div>').addClass('zoom__img-back');
    let $fixedImgWrap = $('<div></div>').append($backGround).addClass('zoom__img-wrap');
    $(littleImgClass).each((i, el) => {
      $(el).attr('data-id', i) // id to every little img
        // let $imgW = $('<div></div>').addClass('zoom__img-wrap-in')
      let srcForFixed = $(el).css('background-image').replace(/^\S*zoomer\//, '').replace('")', '');
      let $item = $('<img>').addClass('zoom__img-item').attr('src', srcForFixed)
        .attr('data-id-item', i) // id to every big img;
        // $imgW.append($item);
      $backGround.append($item);
    })
    $(nodeInsert).append($fixedImgWrap);
  }

  class Zoomer {
    constructor(smallImgCol) {
      let _this = this;
      this.oldIndex;
      this.initSmallImgWidth()
      this.smallImgCol = smallImgCol;
      this._currentFixedImgIndex;

      this.viewHeght = $(window).height();
      this.viewWidth = $(window).width();

      this.zoomImgWrapMain = document.querySelector('.zoom__img-wrap');
      this.zoomImgBack = document.querySelector('.zoom__img-back');
      this.zoomImgsAll = document.querySelectorAll('.zoom__img-item');

      this.initSizesAndPosFixedImgs()();

      $(smallImgCol).click(function() { _this.clickOpenZoomImg(this) });
      // $('.fixed-img').click(function() { _this.clickNextImg(this) });
      // $('.fixed-img-back').click(function() { _this.closeImg(this) });
      $(window).resize(function() { _this.onResize() });
    }


    clickOpenZoomImg(target) {
      let id = target.getAttribute('data-id');
      let zoomImg = this.zoomImgBack.querySelector('[data-id-item="' + id + '"]');

      let zoomPos = zoomImg.getAttribute('data-point-start');

      this.zoomImgWrapMain.style.display = 'block';
      Array.prototype.forEach.call(this.zoomImgsAll, (el, i) => {
        el.style.left = (0 - zoomPos) + 'px';
      })
      this.zoomImgBack.style.width = zoomImg.clientWidth - 1 + 'px';

      $('.zoom__img-wrap').
      animate({
        opacity: 1,
      }, 400);
    }

    onResize() {
      this.viewHeght = $(window).height();
      this.viewWidth = $(window).width();
      if ($('.fixed-img:visible').length > 0) {
        // this.initSizeImg();
      }
      this.initSmallImgWidth();
    }

    clickNextImg(target) {
      let sourceOfThisImg = $('.fixed-img').attr('src');
      this._currentFixedImgIndex = findImgIndex(sourceOfThisImg);
      this._lastFixedImgIndex = this.smallImgCol.length;
      let nextFixedImgIndex;
      let firstPartOfSource = sourceOfThisImg.split(this._currentFixedImgIndex)[0];
      let lastPartOfSource = sourceOfThisImg.split(this._currentFixedImgIndex)[1];

      if (this._currentFixedImgIndex === this._lastFixedImgIndex) {
        nextFixedImgIndex = 1
      } else { nextFixedImgIndex = this._currentFixedImgIndex + 1 }

      let sourceOfNextImg = firstPartOfSource + nextFixedImgIndex + lastPartOfSource;
      $(target).css('opacity', '0').attr('src', sourceOfNextImg);
    }

    closeImg(target) {
      let viewWidthNow = $(window).width();
      // $('.fixed-img-wrap').animate({ opacity: .1 }, 280).hide(0);
      if (viewWidthNow !== this.viewWidthNow) {
        this.initSmallImgWidth();
      }
    }

    initSizeImg(zoomImg, isWrapPos = false) {
      let naturalHeight = $(zoomImg)[0].naturalHeight;
      let naturalWidth = $(zoomImg)[0].naturalWidth;
      $(zoomImg).css({ 'max-height': naturalHeight, 'max-width': naturalWidth }); //didn't use

      let zoomImgHeight = $(zoomImg).height();
      let zoomImgWidth = $(zoomImg).width();

      let isHeight = false;
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
    initSmallImgWidth() {
      $('.pane__img-outside').each(function(i, el) {
        $(el).find('.pane__img').css('height', $(el).css('padding-bottom'))
      })
    }
    initSizesAndPosFixedImgs(isRecursion = false) {
      return () => {
        if (!isRecursion) {
          this.items = Array.prototype.slice.call(document.querySelectorAll('.zoom__img-item'));
          this.i = 0;
          this.oldIndex = this.i;
        }
        while (this.i < this.items.length) {
          if (this.i !== this.oldIndex) {
            this.oldIndex = this.i;
            clearInterval(this.sizingInterval)
          }
          this.getRender(this.items[this.i], true);
          if (this.i === this.items.length) {
            this.pointStart = 0;
            this.giveZoomPos();
            this.zoomImgWrapMain.style.opacity = '0';
            this.zoomImgWrapMain.style.display = 'none'
          }
        }
      }
    }
    giveZoomPos() {
      $('.zoom__img-item').each((i, el) => {
        $(el).attr('data-point-start', this.pointStart);
        this.pointStart += $(el).width();
      })
    }
    getRender(img, isStartInit) {
      if (img.complete) {
        if (!isStartInit) {
          clearInterval(this.isImgRendered);
        } else {
          this.i += 1
        }
        this.initSizeImg(img);
        return;
      }
      if (isStartInit) {
        this.sizingInterval = setInterval(this.initSizesAndPosFixedImgs(true), 500)
      }
    }
  }
  window.zoomerBuildDom = zoomerBuildDom;
  window.Zoomer = Zoomer;
})()

$(function() {
  zoomerBuildDom(document.querySelectorAll('.pane__img'));
  $(window).on('load', function() {
    let zoomer = new Zoomer('.pane__img');
  })
})