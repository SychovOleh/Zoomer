(function() {
  const findImgIndex = (inputLink) => {
    let linkToArr = inputLink.split('/');
    return Number(linkToArr[linkToArr.length - 1].replace('.jpg', ''));
  }

  class Zoomer {
    constructor(smallImgCol, fixedImgFolderName = 'fixed_img', nodeInsert = 'body') {
      this.fixedImgFolderName = fixedImgFolderName;
      this.nodeInsert = nodeInsert;
      this._buildZoomerDom = this.buildDom();
      this.smallImgCol = smallImgCol;

      this._currentFixedImgIndex;

      let _this = this;
      $(smallImgCol).click(function() { _this.clickOpenFixedImg(this) });
      $('.fixed-img').click(function() { _this.clickNextImg(this) });
      $('.fixed-img-back').click(function() { _this.closeImg(this) });
      $(window).resize(function() { _this.resizeFixedImg() });
    }

    initPosition() {
      let naturalHeight = $(this.$img)[0].naturalHeight;
      let naturalWidth = $(this.$img)[0].naturalWidth;
      $(this.$img).css({ 'max-height': naturalHeight, 'max-width': naturalWidth });

      let viewHeght = $(window).height();
      let viewWidth = $(window).width();
      let fixedImgHeight = $(this.$img).height();
      let fixedImgWidth = $(this.$img).width();

      let isHeight = false;
      if (fixedImgHeight / viewHeght > fixedImgWidth / viewWidth) {
        isHeight = true;
      }

      if (isHeight) {
        $(this.$img).css({ 'max-height': viewHeght * .86, 'width': 'auto' });
      } else {
        $(this.$img).css({ 'max-width': viewWidth * .86, 'height': 'auto' });
      }

      let fixedImgPositionTop = (viewHeght - $(this.$img).height()) / 2;
      let fixedImgPositionLeft = (viewWidth - $(this.$img).width()) / 2;
      $('.fixed-img-wrap').css({ 'top': fixedImgPositionTop, 'left': fixedImgPositionLeft });

      $(this.$img).animate({ opacity: 1 }, 300);
    }

    getRender() {
      return () => {
        if (this.$img[0].complete) {
          clearInterval(this.isImgRendered);
          this.initPosition()
        }
      }
    }

    clickOpenFixedImg(target) {
      $('.fixed-img-wrap').css('opacity', '1').show(0);
      let smallImgLink = $(target).attr('src');

      this.fixedImgLink = smallImgLink.replace('150px', this.fixedImgFolderName);

      $(this.$img).css('opacity', '0').attr('src', this.fixedImgLink);
      this.isImgRendered = setInterval(this.getRender(), 0);
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

      this.isImgRendered = setInterval(this.getRender(), 0);
    }

    closeImg(target) {
      $('.fixed-img-wrap').animate({ opacity: .1 }, 280).hide(0);
    }

    resizeFixedImg() {
      if ($('.fixed-img:visible').length > 0) {
        this.initPosition();
      }
    }

    buildDom() {
      this.$img = $('<img></img>').addClass('fixed-img');
      this.$backGround = $('<span></span>').addClass('fixed-img-back');
      let fixedImgWrap = $('<span></span>').css({ 'position': 'fixed', 'z-index': '1000' })
        .append(this.$backGround).append(this.$img).addClass('fixed-img-wrap');
      $(this.nodeInsert).append(fixedImgWrap.get());
    }
  }
  window.Zoomer = Zoomer;
})()

$(function() {
  let zoomer = new Zoomer($('.pane__img').get());
})