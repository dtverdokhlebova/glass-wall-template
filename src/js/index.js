document.addEventListener('DOMContentLoaded', function () {
  animation()
  accordions()
  solutions()
  uiInput()
  header()
  howWorking()
  tabs()
  request()
  pageBgCalc()
  popup()
  phoneMob()
  video()

  window.addEventListener('load', function () {
    pageBgCalc()
  })
  window.addEventListener('resize', function () {
    howWorking()
    pageBgCalc()
  })
})

function animation() {
  animationStartBg()
  animationAbout()
  animationContacts()
  animationSolutions()
  window.addEventListener('resize', animationSolutions)
}

function animationStartBg() {
  const blurBlock = document.querySelector('.section__bg-img img')
  if (blurBlock) {
    gsap.to(blurBlock, {
      filter: 'blur(15px)',
      scrollTrigger: {
        start: 'top top',
        end: '400px',
        scrub: 1
      }
    })
  }
}

function animationAbout() {
  const numberBlocks = document.querySelectorAll('.about__value')
  if (numberBlocks.length > 0) {
    const tl = gsap.timeline({
      paused: true
    })

    for (const block of numberBlocks) {
      const targetNumber = Number.parseInt(block.dataset.value, 10)

      tl.to(block, {
        innerHTML: targetNumber,
        duration: 1,
        ease: 'none',
        onUpdate: function () {
          block.innerHTML = (Math.round(block.innerHTML)).toLocaleString('ru-RU')
        }
      })
    }

    ScrollTrigger.create({
      trigger: '.about',
      start: 'top center',
      end: 'bottom center',
      toggleActions: 'play none none none',
      onToggle: function (self) {
        if (self.isActive) {
          tl.play()
        }
      }
    })
  }
}

function animationContacts() {
  const block = document.querySelector('.contacts')
  if (block) {
    const getOverlap = () => Math.min(window.innerHeight, block.offsetHeight)
    adjustBlockOverlap = () => {
      block.style.marginTop = `${-getOverlap()}px`
    }
    adjustBlockOverlap()

    ScrollTrigger.addEventListener('revert', adjustBlockOverlap)

    ScrollTrigger.create({
      trigger: block,
      start: () => `top ${window.innerHeight - getOverlap()}`,
      end: () => `+=${getOverlap()}`,
      pin: true
    })
  }
}

function animationSolutions() {
  const block = document.querySelector('.js-solutions-animation')

  if (block) {
    const items = block.querySelectorAll('.solutions__item')
    const itemsLength = items.length
    const itemHeight = items[0].offsetHeight
    const windowHeight = window.innerHeight
    const headerHeight = document.querySelector('.header').offsetHeight
    const itemOffsetStep = 20
    // последние 40 - запас, чтобы блоки были не в края экрана
    const minHeight = itemHeight + headerHeight + ((itemsLength - 1) * itemOffsetStep) + 40
    const animClass = 'solutions--scroll-animation'

    if (minHeight < windowHeight) {
      block.classList.add(animClass)
      for (const item of items) {
        const index = [...item.parentNode.children].indexOf(item)
        const itemOffset = index * itemOffsetStep
        item.style.setProperty('--offset-top', `${itemOffset}px`)
      }
    } else {
      block.classList.remove(animClass)
    }
  }
}

function uiInput() {
  inputFiles()
  for (const input of document.querySelectorAll('[data-mask=phone]')) {
    IMask(input, {
      mask: '+7 num',
      lazy: false,
      blocks: {
        'num': {
          mask: '(000) 000-00-00',
          lazy: true
        }
      }
    })
  }
}

function inputFiles() {
  window.formFiles = new Map()

  document.addEventListener('change', (event) => {
    const inputFile = event.target.closest('[data-input-file] input')
    if (inputFile) {
      const files = inputFile.files
      if (files.length > 0) {
        const filesList = Object.keys(files).map((filesIndex) => files[filesIndex])
        const inputId = inputFile.getAttribute('id')
        addFiles(filesList, inputId)

        const filesWrapper = inputFile.closest('[data-input-file]').querySelector('.ui-input__files')
        for (let index = 0; index < Object.values(files).length; index++) {
          const fileElement = document.createElement('div')
          fileElement.classList = 'ui-input__file'
          const fileName = document.createElement('div')
          fileName.classList = 'ui-input__file-name'
          fileName.textContent = files[index].name
          const fileDeleteButton = document.createElement('button')
          fileDeleteButton.type = 'button'
          fileDeleteButton.classList = 'ui-input__file-del'
          fileDeleteButton.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.512325 1.92654L3.69537 5.10958L0.512327 8.29262C0.122702 8.68225 0.122864 9.31525 0.513388 9.70578C0.906634 10.099 1.5366 10.0968 1.92654 9.70683L5.10958 6.52379L8.29262 9.70683C8.68225 10.0965 9.31525 10.0963 9.70578 9.70578C10.099 9.31253 10.0968 8.68256 9.70683 8.29262L6.52379 5.10958L9.70683 1.92654C10.0965 1.53692 10.0963 0.903912 9.70577 0.513388C9.31253 0.120141 8.68256 0.122388 8.29262 0.512327L5.10958 3.69537L1.92654 0.512327C1.53691 0.122703 0.903909 0.122864 0.513385 0.513388C0.120138 0.906635 0.122385 1.5366 0.512325 1.92654Z" fill="currentColor"/>
            </svg>`
          fileDeleteButton.addEventListener('click', function (event) {
            event.preventDefault()
            const index = [...fileElement.parentElement.children].indexOf(fileElement)
            removeFile(index, inputId)
            fileElement.remove()
          })
          fileElement.append(fileName)
          fileElement.append(fileDeleteButton)
          filesWrapper.append(fileElement)
        }
        const filesLabel = inputFile.closest('[data-input-file]').querySelector('label')

        inputFile.value = ''
      }
    }
  })
}

function addFiles(files, inputId) {
  if (window.formFiles.has(inputId)) {
    const newFiles = [...window.formFiles.get(inputId), ...files]
    window.formFiles.set(inputId, newFiles)
  } else {
    window.formFiles.set(inputId, files)
  }
}

function removeFile(index, inputId) {
  const files = window.formFiles.get(inputId)
  files.splice(index, 1)
  window.formFiles.set(inputId, files)
}

function accordions() {
  const accordionsItems = document.querySelectorAll('.accordions-item')
  for (const item of accordionsItems) {
    const head = item.querySelector('.accordions-item__head')
    const body = item.querySelector('.accordions-item__body')
    const closeButton = item.querySelector('.accordions-item__close')
    head.addEventListener('click', () => {
      body.classList.toggle('active')
    })
    closeButton.addEventListener('click', () => {
      body.classList.toggle('active')
    })
  }
}

function header() {
  const headerBlock = document.querySelector('.header')

  if (headerBlock) {
    window.addEventListener('scroll', function () {
      let botTriggerCoord = 0
      const mainBanner = this.document.querySelector('.banner')
      if (mainBanner) {
        botTriggerCoord = mainBanner.getBoundingClientRect().bottom + window.pageYOffset
      }

      if (document.documentElement.scrollTop > botTriggerCoord) {
        headerBlock.classList.add('header--fixed')
      } else {
        headerBlock.classList.remove('header--fixed')
      }
    })

    window.addEventListener('load', headerHeightCalc)
    window.addEventListener('resize', headerHeightCalc)
  }
}

function headerHeightCalc() {
  const headerBlock = document.querySelector('.header')
  document.documentElement.style.setProperty('--header-height', `${headerBlock.offsetHeight}px`)
}

function howWorking() {
  const blocks = document.querySelectorAll('.how-working')
  for (const block of blocks) {
    const items = block.querySelectorAll('.how-working__ui-h5')
    const heights = []

    for (const item of items) {
      item.style.minHeight = 'auto'
      heights.push(item.offsetHeight)
    }

    const maxHeight = `${Math.max(...heights) + 1}px`

    for (const item of items) {
      item.style.minHeight = maxHeight
    }
  }
}

function pageBgCalc() {
  const img = document.querySelector('.section__bg-img img')
  const viewportHeight = document.documentElement.clientHeight
  img.style.height = `${viewportHeight}px`
}

function phoneMob() {
  const block = document.querySelector('.phone-mob')
  if (block) {
    let lastScrollTop = 0
    const visibleClass = 'phone-mob--visible'
    window.addEventListener('scroll', function () {
      const newSrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (newSrollTop > lastScrollTop) {
        block.classList.remove(visibleClass)
      } else if (newSrollTop < lastScrollTop) {
        block.classList.add(visibleClass)
      }
      lastScrollTop = newSrollTop <= 0 ? 0 : newSrollTop
    })
  }
}

function popup() {
  for (const popupElement of document.querySelectorAll('.popup')) {
    popupElement.querySelector('.popup__close-button').addEventListener('click', function () {
      popupElement.classList.remove('active')
      document.querySelector('html').classList.remove('lock-scroll')
      if (popupElement.querySelector('.popup-video')) {
        window.stopVideo(popupElement.querySelector('.popup-video'))
      }
    })

    popupElement.addEventListener('click', (event) => {
      if (event.target === popupElement) {
        popupElement.classList.remove('active')
        document.querySelector('html').classList.remove('lock-scroll')
        if (popupElement.querySelector('.popup-video')) {
          window.stopVideo(popupElement.querySelector('.popup-video'))
        }
      }
    })
  }

  window.openPopup = function (element) {
    const popupElement = document.querySelector(element)
    if (popupElement) {
      document.querySelector(element).classList.add('active')
      document.querySelector('html').classList.add('lock-scroll')
    }
  }

  window.closePopup = function (element) {
    const popupElement = document.querySelector(element)
    if (popupElement) {
      document.querySelector(element).classList.remove('active')
      document.querySelector('html').classList.remove('lock-scroll')
      if (popupElement.querySelector('.popup-video')) {
        window.stopVideo(popupElement.querySelector('.popup-video'))
      }
    }
  }
}
function request() {
  $('[data-js-form-validation]').parsley()
}

function solutions() {
  const blocks = document.querySelectorAll('.solutions__item')

  for (const block of blocks) {
    const slider = block.querySelector('.solutions__slider-main .swiper')
    const thumb = block.querySelector('.solutions__thumbs')

    const sliderSwiper = new Swiper(slider, {
      slidesPerView: 1,
      loop: true,
      speed: 500,
      spaceBetween: 5,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      on: {
        autoplayTimeLeft(swiper, time, progress) {
          swiper.el.style.setProperty('--progress', (1 - progress))
        },
        slideChange(swiper) {
          if (thumb) {
            const activeIndex = swiper.realIndex
            const items = thumb.querySelectorAll('.solutions__thumbs-item')
            for (const item of items) {
              item.classList.remove('active')
            }
            items[activeIndex].classList.add('active')
          }
        }
      }
    })

    if (thumb) {
      const items = thumb.querySelectorAll('.solutions__thumbs-item')
      for (const item of items) {
        item.addEventListener('click', (event) => {
          const index = [...event.target.parentNode.children].indexOf(event.target)
          sliderSwiper.slideToLoop(index)
        })
      }
    }
  }
}

function tabs() {
  document.addEventListener('click', (event) => {
    const tabHeadItem = event.target.closest('.tabs-head__item')
    if (tabHeadItem) {
      tabOpen(tabHeadItem)
    }
  })

  window.openTab = function (element) {
    tabOpen(element)
  }
}

function tabOpen(headItem) {
  const siblingsHeads = headItem.closest('.tabs-head').querySelectorAll('.tabs-head__item')
  const itemGroup = headItem.closest('.tabs-head').dataset.group
  const bodyData = document.querySelectorAll(`.tabs-body[data-group='${itemGroup}']`)
  const index = [...headItem.parentNode.children].indexOf(headItem)
  for (const head of siblingsHeads) {
    head.classList.remove('tabs-head__item--active')
  }
  headItem.classList.add('tabs-head__item--active')

  for (const body of bodyData) {
    const bodyItems = body.children
    for (const item of bodyItems) {
      item.classList.remove('active')
    }
    bodyItems[index].classList.add('active')
  }
}

function video() {
  window.playVideo = function (element) {
    const iframe = element.querySelector('iframe')
    const iframeSource = iframe.getAttribute('src')
    iframe.src = `${iframeSource}&autoplay=1`
  }

  window.stopVideo = function (element) {
    const iframe = element.querySelector('iframe')
    const iframeSource = iframe.getAttribute('src')
    iframe.src = `${iframeSource.replace('&autoplay=1', '')}&enablejsapi=1`
  }
}
