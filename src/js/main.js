(function() {
  const zoomerBuildDom = (littleImgClass, nodeInsert = 'body') => {
    let $backGround = $('<div></div>').addClass('zoom__img-back');
    let $closeIcon = $('<span></span>').addClass('icon-close icon').append($('<span></span>').addClass('icon-close-in icon'));
    let $nextSlide = $('<div></div>').addClass('flip flip-next').append($('<span></span>').addClass('icon-next icon'));
    let $prevSlide = $('<div></div>').addClass('flip flip-prev').append($('<span></span>').addClass('icon-prev icon'));
    let $fixedImgWrap = $('<div></div>').addClass('zoom__img-wrap')
      .append($backGround).append($closeIcon).append($nextSlide).append($prevSlide);

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

      // this.viewHeght = $(window).height();
      // this.viewWidth = $(window).width();
      this.zoomImgWrapMain = document.querySelector('.zoom__img-wrap');
      this.zoomImgBack = document.querySelector('.zoom__img-back');
      this.zoomImgsAll = document.querySelectorAll('.zoom__img-item');

      this.initSizesAndPosFixedImgs()();

      $(smallImgCol).click(function() { _this.clickOpenZoomImg(this) });
      $('.flip').click(function() { _this.clickNextImg(this) });
      $('.icon-close-in').click(function() { _this.closeImg(this) });
      $(window).resize(function() { _this.onResize() });
    }

    clickNextImg(target) {
      $('.flip').css('display', 'block');

      let nextIndex;
      if (target.classList.contains('flip-next')) {
        nextIndex = this._index + 1;
      } else {
        nextIndex = this._index - 1;
      }

      let nextSlide = this.zoomImgBack.querySelector('[data-id-item="' + nextIndex + '"]');
      let zoomPos = nextSlide.getAttribute('data-point-start');

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
        step: function(now) {
          $(".zoom__img-item:gt(0)").css("left", now);
        }
      });

      $(this.zoomImgBack).animate({
        width: nextSlide.clientWidth
      }, {
        duration: 400,
        queue: false,
      });
    }

    clickOpenZoomImg(target) {
      this._index = Number(target.getAttribute('data-id'));

      if (this._index === this.zoomImgsAll.length - 1) {
        document.querySelector('.flip-next').style.display = 'none';
      } else if (this._index === 0) {
        document.querySelector('.flip-prev').style.display = 'none';
      } else {
        $('.flip').css('display', 'block');
      }

      let zoomImg = this.zoomImgBack.querySelector('[data-id-item="' + this._index + '"]');

      let zoomPos = zoomImg.getAttribute('data-point-start');

      this.zoomImgWrapMain.style.display = 'block';
      Array.prototype.forEach.call(this.zoomImgsAll, (el, i) => {
        el.style.left = (0 - zoomPos) + 'px';
      })
      this.zoomImgBack.style.width = zoomImg.clientWidth - 1 + 'px';

      $('.zoom__img-wrap').animate({
        opacity: 1,
      }, 400);
    }

    closeImg(target) {
      let viewWidthNow = $(window).width();
      $('.zoom__img-wrap').animate({ opacity: 0 }, 280).hide(0);
      if (viewWidthNow !== this.viewWidthNow) {
        this.initSmallImgWidth();
      }
    }



    initSizeImg(zoomImg) {
      this.viewHeght = $(window).height();
      this.viewWidth = $(window).width();
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
    }

    onResize() {
      this.viewHeght = $(window).height();
      this.viewWidth = $(window).width();
      if ($('.zoom__img-wrap:visible').length > 0) {
        this.initSizesAndPosFixedImgs(false, true)();
        this.initSmallImgWidth();
        return
      }
      this.initSmallImgWidth();
      this.initSizesAndPosFixedImgs(false, true)();
    }


    initSizesAndPosFixedImgs(isRecursion, isUseZoomer) {
      return () => {
        if (!isRecursion) {
          this.items = Array.prototype.slice.call(document.querySelectorAll('.zoom__img-item'));
          this.i = 0;
          this.oldIndex = this.i;
        }

        if (!isUseZoomer) {
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
              this.zoomImgWrapMain.style.display = 'none';
              return;
            }
          }
        }

        for (let i = 0; i < this.zoomImgsAll.length; i += 1) {
          this.initSizeImg(this.zoomImgsAll[i]);
          this.giveZoomPos();
        }

      }
    }
    giveZoomPos(oneEl) {
      if (!oneEl) {
        $('.zoom__img-item').each((i, el) => {
          $(el).attr('data-point-start', this.pointStart);
          this.pointStart += $(el).width();
        })
        return
      }
      $(oneEl).attr('data-point-start', this.pointStart)
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
    initSmallImgWidth() {
      $('.pane__img-outside').each(function(i, el) {
        $(el).find('.pane__img').css('height', $(el).css('padding-bottom'))
      })
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