(function () {
  const zoomerBuildDom = (littleImgClass, nodeInsert = 'body') => {
    let $backGroundWrap = $('<div></div>').addClass('zoom__img-back-wrap');
    let fictiveImg = $('<span></span>').addClass('fictive').appendTo($backGroundWrap);
    let $backGround = $('<div></div>').addClass('zoom__img-back').appendTo($backGroundWrap);
    let $closeIcon = $('<span></span>').addClass('icon-close icon').append($('<span></span>').addClass('icon-close-in icon'));
    let $nextSlide = $('<div></div>').addClass('flip flip-next').append($('<span></span>').addClass('icon-next icon'));
    let $prevSlide = $('<div></div>').addClass('flip flip-prev').append($('<span></span>').addClass('icon-prev icon'));
    let $fixedImgWrap = $('<section></section>').addClass('zoom__img-wrap').append($backGroundWrap).append($closeIcon).append($nextSlide).append($prevSlide);

    $(littleImgClass).each((i, el) => {
      $(el).attr('data-id', i); // id to every little img
      let srcForFixed = $(el).css('background-image').replace(/^\S*zoomer\//, '').replace('")', '');
      let $item = $('<img>').addClass('zoom__img-item').attr('src', srcForFixed).attr('data-id-item', i); // id to every big img;
      $backGround.append($item);
    });

    $(nodeInsert).append($fixedImgWrap);
  };

  class Zoomer {
    constructor(smallImgCol) {
      let _this = this;
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

    onResize() {
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

    initSizeImg(zoomImg, isInitDom) {
      if (isInitDom) {
        let naturalHeight = $(zoomImg)[0].naturalHeight;
        let naturalWidth = $(zoomImg)[0].naturalWidth;
        $(zoomImg).css({ 'max-height': naturalHeight, 'max-width': naturalWidth });
      }

      this.viewHeght = $(window).height();
      this.viewWidth = $(window).width();

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

      if (!isInitDom && this.isZoomerVisible) {
        // !!!!!!!!!!
        this.zoomImgBack.style.width = zoomImg.clientWidth - 1 + 'px';
      }
    }

    clickNextImg(target) {
      this.isPrevSlideRendered();

      $('.flip').css('display', 'block');

      this.nextIndex;
      let isNextSlide = false;
      if (target.classList.contains('flip-next')) {
        this.nextIndex = this._index + 1;
        isNextSlide = true;
      } else {
        this.nextIndex = this._index - 1;
      }

      this.curSlide = this.zoomImgBack.querySelector('[data-id-item="' + this._index + '"]');
      this.nextSlide = this.zoomImgBack.querySelector('[data-id-item="' + this.nextIndex + '"]');

      this.isSlideLeafing = true;
      this.initSizeImg(this.nextSlide);

      this._index = this.nextIndex;
      if (this.nextIndex === this.zoomImgsAll.length - 1) {
        document.querySelector('.flip-next').style.display = 'none';
      } else if (this.nextIndex === 0) {
        document.querySelector('.flip-prev').style.display = 'none';
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

    getRender(img, isStartInit) {
      if (img.complete) {
        this.i += 1;
        this.initSizeImg(img, true);
        return;
      }
      if (isStartInit) {
        this.sizingInterval = setInterval(this.initSizesAndPosFixedImgs(), 500);
      }
    }

    initSizesAndPosFixedImgs() {
      return () => {
        this.items = Array.prototype.slice.call(document.querySelectorAll('.zoom__img-item'));
        this.i = 0;
        this.oldIndex = this.i;

        while (this.i < this.items.length) {
          if (this.i !== this.oldIndex) {
            this.oldIndex = this.i;
            clearInterval(this.sizingInterval);
          }

          this.getRender(this.items[this.i], true);
        }
      };
    }

    clickOpenZoomImg(target) {
      this._index = Number(target.getAttribute('data-id'));

      for (let i = 0; i < this.zoomImgsAll.length; i += 1) {
        if (this.zoomImgsAll[i].style.display !== 'none' || !this.zoomImgsAll[i].style.display) {
          this.zoomImgsAll[i].style.display = 'none';
        }
        if (this.zoomImgsAll[i].style.left !== '0') {
          this.zoomImgsAll[i].style.left = '0';
        }
      }

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

    isPrevSlideRendered() {
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

    goNextSlide() {
      let newWidth = this.nextSlide.clientWidth;
      this.nextSlide.style.left = -newWidth;

      $(this.curSlide).finish().animate({ left: -newWidth }, {
        duration: 150,
        start: () => {
          $(this.zoomImgBack).finish().animate({
            width: newWidth
          }, {
            duration: 150,
            always: () => {
              $(this.curSlide).css('display', 'none').animate({
                left: 0,
                zIndex: 3
              }, {
                duration: 0
              });
              $(this.nextSlide).animate({
                left: 0
              }, 0);
            }
          });
        }
      });
    }

    goPrevSlide() {
      let newWidth = this.nextSlide.clientWidth;
      this.nextSlide.style.left = newWidth;

      $(this.curSlide).finish().animate({ left: newWidth }, {
        duration: 150,
        start: () => {
          $(this.zoomImgBack).finish().animate({
            width: newWidth
          }, {
            duration: 150,
            always: () => {
              $(this.curSlide).css('display', 'none').animate({
                left: 0,
                zIndex: 3
              }, {
                duration: 0
              });
              $(this.nextSlide).animate({
                left: 0
              }, 0);
            }
          });
        }
      });
    }

    closeImg() {
      let viewWidthNow = $(window).width();
      let viewHeighthNow = $(window).height();
      if (viewWidthNow !== this.viewWidthWhenOpen || viewHeighthNow !== this.viewHeightWhenOpen) {
        this.initSmallImgWidth();
      }

      $('.zoom__img-wrap').animate({ opacity: 0 }, 150, false).hide(0);

      this.isPrevSlideRendered();
      this.isSlideLeafing = false;
    }

    initSmallImgWidth() {
      $('.pane__img-outside').each(function (i, el) {
        $(el).find('.pane__img').css('height', $(el).css('padding-bottom'));
      });
    }

    get isZoomerVisible() {
      return $('.zoom__img-wrap:visible').length > 0;
    }
  }
  window.zoomerBuildDom = zoomerBuildDom;
  window.Zoomer = Zoomer;
})();

$(function () {
  // PRELOADER
  // setTimeout(function() {
  //   $('body').addClass('loaded');
  // }, 3000);
  // PRELOADER
  // 
  // 
  zoomerBuildDom(document.querySelectorAll('.pane__img'));
  $(window).on('load', function () {
    let zoomer = new Zoomer('.pane__img');
    window.zoomer = zoomer;
    $('body').addClass('loaded');
  });
});