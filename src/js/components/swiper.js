import Swiper from 'swiper'
import { Navigation, Pagination, Thumbs, EffectFade, EffectCoverflow } from 'swiper/modules'
Swiper.use([ Navigation, Pagination ])

const swiperIcons = Object.assign({}, {
  prev: `
    <span class="icon">
      <svg>
        <use xlink:href="img/icons/swiper-arrow-prev.svg#svg-swiper-arrow-prev"></use>
      </svg>
    </span>`,
  next: `
    <span class="icon">
      <svg>
        <use xlink:href="img/icons/swiper-arrow-next.svg#svg-swiper-arrow-next"></use>
      </svg>
    </span>`
})

document.querySelectorAll('.swiper-button-prev')?.forEach((button) => {
  button.innerHTML = swiperIcons.prev
})

document.querySelectorAll('.swiper-button-next')?.forEach((button) => {
  button.innerHTML = swiperIcons.next
})

document.querySelectorAll('.modal-stories')?.forEach(element => {
  const swiperElementMain = element.querySelector('.swiper-stories')
  const buttonVolume = element.querySelector('.btn-volume')

  const swiperStories = new Swiper(swiperElementMain, {
    slidesPerView: 'auto',
    spaceBetween: 24,
    centeredSlides: true,
    slideToClickedSlide: true,
  })

  const storiesInstances = []

  swiperElementMain.querySelectorAll('.stories')?.forEach((storyElement, storyIndex) => {
    const swiperElement = storyElement.querySelector('.swiper')
    const swiperPagination = storyElement.querySelector('.swiper-pagination')
    const swiperPrev = storyElement.querySelector('.swiper-button-prev')
    const swiperNext = storyElement.querySelector('.swiper-button-next')

    let timeoutId = null
    let progressIntervals = {}

    const swiper = new Swiper(swiperElement, {
      slidesPerView: 1,
      nested: true,
      allowTouchMove: false,
      navigation: false,
      pagination: {
        el: swiperPagination,
        type: 'custom',
        renderCustom: (swiper, current, total) => {
          return Array.from({ length: total })
            .map((_, index) => `<div class="progress-bar" data-index="${index}"><span></span></div>`)
            .join('')
        }
      }
    })

    function goToNextSlide() {
      if (swiper.activeIndex < swiper.slides.length - 1) {
        swiper.slideNext()
      }
      else {
        swiperStories.slideNext()
      }
    }

    function startProgress(duration) {
      const progressBars = swiperPagination.querySelectorAll('.progress-bar span')
      // Для всех пройденных слайдов ставим ширину 100%
      progressBars.forEach((span, index) => {
        span.style.width = index < swiper.activeIndex ? '100%' : '0%'
      })
      const currentSpan = progressBars[swiper.activeIndex]
      if (!currentSpan) return
      let startTime = performance.now()
      function updateProgressBar(time) {
        let elapsed = time - startTime
        let progress = Math.min((elapsed / duration) * 100, 100)
        currentSpan.style.width = progress + '%'
        if (progress < 100) {
          progressIntervals[swiper.activeIndex] = requestAnimationFrame(updateProgressBar)
        }
      }
      progressIntervals[swiper.activeIndex] = requestAnimationFrame(updateProgressBar)
    }

    function stopProgress() {
      Object.keys(progressIntervals).forEach(key => {
        cancelAnimationFrame(progressIntervals[key])
      })
      progressIntervals = {}
    }

    function resetSwiper() {
      clearTimeout(timeoutId)
      stopProgress()

      swiper.slideTo(0, 0)

      swiper.slides.forEach(slide => {
        const video = slide.querySelector('video')

        if (video) {
          video.pause()
          video.currentTime = 0
          video.onended = null
        }
      })

      const progressBars = swiperPagination.querySelectorAll('.progress-bar span')
      progressBars.forEach(span => {
        span.style.width = '0%'
      })
    }

    function setupCurrentSlide() {
      clearTimeout(timeoutId)
      stopProgress()
      const currentSlide = swiper.slides[swiper.activeIndex]
      const pictureElement = currentSlide.querySelector('picture')
      const videoElement = currentSlide.querySelector('video')

      if (pictureElement) {
        startProgress(5000)
        timeoutId = setTimeout(goToNextSlide, 5000)
      }
      else if (videoElement) {
        if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA или выше
          setupVideoProgress(videoElement)
        } else {
          videoElement.addEventListener('loadedmetadata', function handler() {
            videoElement.removeEventListener('loadedmetadata', handler)
            setupVideoProgress(videoElement)
          })
        }
      }
    }

    function setupVideoProgress(videoElement) {
      videoElement.currentTime = 0
      videoElement.play()
      startProgress(videoElement.duration * 1000)
      videoElement.onended = goToNextSlide
    }

    function updateNavigationButtons() {
      // For prev button:
      // Disable only if we're at the first slide of swiperStories AND at the first slide of inner swiper
      if (swiperStories.activeIndex === 0 && swiper.activeIndex === 0) {
        swiperPrev.setAttribute('disabled', 'disabled')
      } else {
        swiperPrev.removeAttribute('disabled')
      }

      // For next button:
      // Disable only if we're at the last slide of swiperStories AND at the last slide of inner swiper
      if (swiperStories.activeIndex === swiperStories.slides.length - 1 &&
          swiper.activeIndex === swiper.slides.length - 1) {
        swiperNext.setAttribute('disabled', 'disabled')
      } else {
        swiperNext.removeAttribute('disabled')
      }
    }

    swiper.on('slideChange', () => {
      const previousSlide = swiper.slides[swiper.previousIndex]
      if (previousSlide) {
        const prevVideo = previousSlide.querySelector('video')
        if (prevVideo) {
          prevVideo.pause()
          prevVideo.currentTime = 0
          prevVideo.onended = null
        }
      }
      setupCurrentSlide()
      updateNavigationButtons()
    })

    // Кастомные обработчики навигации
    swiperPrev.addEventListener('click', () => {
      if (swiper.activeIndex > 0) {
        swiper.slidePrev()
      }
      else {
        if (swiperStories.activeIndex > 0) {
          swiperStories.slidePrev()
        }
      }
      updateNavigationButtons()
    })

    swiperNext.addEventListener('click', () => {
      if (swiper.activeIndex < swiper.slides.length - 1) {
        swiper.slideNext()
      }
      else {
        if (swiperStories.activeIndex < swiperStories.slides.length - 1) {
          swiperStories.slideNext()
        }
      }
      updateNavigationButtons()
    })

    storiesInstances.push({
      instance: swiper,
      setupCurrentSlide,
      resetSwiper,
      index: storyIndex
    })

    element.addEventListener('shown.bs.modal', () => {
      if (swiperStories.activeIndex === storyIndex) {
        setupCurrentSlide()
      }
      updateNavigationButtons()
    })

    element.addEventListener('hide.bs.modal', () => {
      resetSwiper()
    })
  })

  swiperStories.on('slideChangeTransitionEnd', () => {
    storiesInstances.forEach(story => {
      if (story.index === swiperStories.activeIndex) {
        story.setupCurrentSlide()
      }
      else {
        story.resetSwiper()
      }
    })
    // Обновляем кнопки для всех stories
    storiesInstances.forEach(story => {
      // Предполагаем, что у каждой stories своя навигация, обновляем их кнопки
      const storyElement = element.querySelectorAll('.stories')[story.index]
      const prevBtn = storyElement.querySelector('.swiper-button-prev')
      const nextBtn = storyElement.querySelector('.swiper-button-next')
      if (swiperStories.activeIndex === story.index) {
        prevBtn.removeAttribute('disabled')
        nextBtn.removeAttribute('disabled')
      }
      else {
        prevBtn.setAttribute('disabled', 'disabled')
        nextBtn.setAttribute('disabled', 'disabled')
      }
    })
  })

  function updateGlobalNavigation() {
    element.querySelectorAll('.stories').forEach((storyElement, idx) => {
      const prevBtn = storyElement.querySelector('.swiper-button-prev')
      const nextBtn = storyElement.querySelector('.swiper-button-next')
      const innerSwiper = storiesInstances[idx].instance

      if (swiperStories.activeIndex === idx) {
        // For prev button
        if (swiperStories.activeIndex === 0 && innerSwiper.activeIndex === 0) {
          prevBtn.setAttribute('disabled', 'disabled')
        } else {
          prevBtn.removeAttribute('disabled')
        }

        // For next button
        if (swiperStories.activeIndex === swiperStories.slides.length - 1 &&
            innerSwiper.activeIndex === innerSwiper.slides.length - 1) {
          nextBtn.setAttribute('disabled', 'disabled')
        } else {
          nextBtn.removeAttribute('disabled')
        }
      } else {
        // If not active story, disable both buttons
        prevBtn.setAttribute('disabled', 'disabled')
        nextBtn.setAttribute('disabled', 'disabled')
      }
    })
  }

  updateGlobalNavigation()

  buttonVolume.addEventListener('click', () => {
    const isMuted = buttonVolume.classList.contains('is-active')

    const videos = element.querySelectorAll('video')

    videos.forEach(video => {
      if (isMuted) {
        video.muted = true
      } else {
        video.muted = false
      }
    })

    buttonVolume.classList.toggle('is-active')
  })
})

document.querySelectorAll('[data-swiper]')?.forEach((element) => {
  const type = element.dataset.swiper
  const swiperElement = element.matches('.swiper') ? element : element.querySelector('.swiper')
  const swiperPagination = element.querySelector('.swiper-pagination')
  const swiperPrev = element.querySelector('.swiper-button-prev')
  const swiperNext = element.querySelector('.swiper-button-next')

  let isTouchScreen = window.matchMedia('(hover: none)').matches
  let config = {}

  switch (type) {
    case 'cards':
      config = {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 16,
        navigation: {
          prevEl: swiperPrev,
          nextEl: swiperNext,
        },

        breakpoints: {
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 8,
          },
          576: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 8,
          },
          992: {
            spaceBetween: 16,
          }
        }
      }
      break

    case 'cards-sm':
      config = {
        slidesPerView: 5,
        slidesPerGroup: 5,
        spaceBetween: 16,
        navigation: {
          prevEl: swiperPrev,
          nextEl: swiperNext,
        },

        breakpoints: {
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 8,
          },
          576: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 8,
          },
          992: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 16,
          }
        }
      }
      break

    case 'card-pictures':
      config = {
        slidesPerView: 1,
        nested: true,

        loop: isTouchScreen,

        pagination: {
          el: swiperPagination,
          type: 'bullets',
          clickable: true,
        },

        on: {
          init: function () {
            const swiper = this
            const slides = swiper.slides
            const paginationBullets = swiper.pagination.bullets

            let hoverWrapper = swiper.el.querySelector('.swiper-hover')

            if (!hoverWrapper) {
              hoverWrapper = document.createElement('div')
              hoverWrapper.classList.add('swiper-hover')
              swiper.el.appendChild(hoverWrapper)
            } else {
              hoverWrapper.innerHTML = ''
            }

            slides.forEach((slide, index) => {
              const div = document.createElement('div')
              hoverWrapper.appendChild(div)

              div.addEventListener('mouseenter', () => {
                swiper.slideTo(index)
                paginationBullets[index].click()
              })
            })

            swiper.el.addEventListener('mouseleave', () => {
              swiper.slideTo(0)
              paginationBullets[0].click()
            })
          },
        },
      }
      break

    case 'hero':
      config = {
        slidesPerView: 1,
        loop: true,

        pagination: {
          el: swiperPagination,
          clickable: true,
        },

        navigation: {
          prevEl: swiperPrev,
          nextEl: swiperNext,
        },
      }
      break

    case 'arrivals':
      config = {
        slidesPerView: 'auto',
        spaceBetween: 16,

        breakpoints: {
          0: {
            slidesPerView: 'auto',
            spaceBetween: 8,
          },
          992: {
            slidesPerView: 'auto',
            spaceBetween: 16,
          }
        }
      }
      break

    case 'articles':
      config = {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 16,

        breakpoints: {
          0: {
            slidesPerView: 1.25,
            slidesPerGroup: 1,
            spaceBetween: 8,
          },
          576: {
            slidesPerView: 2.25,
            slidesPerGroup: 2,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 8,
          },
          992: {
            spaceBetween: 16,
          }
        }
      }
      break

    case 'contacts':
      config = {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 16,
        pagination: {
          el: swiperPagination,
          clickable: true,
        },

        navigation: {
          prevEl: swiperPrev,
          nextEl: swiperNext,
        },
      }
      break

    case 'gift':
      config = {
        modules: [ EffectCoverflow ],
        loop: true,
        effect: "coverflow",
        coverflowEffect: {
          rotate: 0,
          stretch: -80,
          depth: 400,
          modifier: 1,
          slideShadows: false,
        },
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        navigation: {
          prevEl: swiperPrev,
          nextEl: swiperNext,
        },
        pagination: {
          el: swiperPagination,
          type: 'bullets',
          clickable: true,
        },

        breakpoints: {
          0: {
            coverflowEffect: {
              rotate: 0,
              stretch: -64,
              depth: 400,
              modifier: 1,
              slideShadows: false,
            },
          },
          768: {
            coverflowEffect: {
              rotate: 0,
              stretch: -80,
              depth: 400,
              modifier: 1,
              slideShadows: false,
            },
          },
        }
      }
      break
    }

  new Swiper(swiperElement, config)
})

document.querySelectorAll('.product-swiper')?.forEach(container => {
  const swiperMainElement = container.querySelector('.product-swiper-main .swiper')
	const swiperThumbElement = container.querySelector('.product-swiper-thumbs .swiper')
  const swiperPagination = container.querySelector('.swiper-pagination')
  const swiperPrev = container.querySelector('.swiper-button-prev')
  const swiperNext = container.querySelector('.swiper-button-next')

	const swiperThumb = new Swiper(swiperThumbElement, {
    slidesPerView: 'auto',
    spaceBetween: 8,
    watchSlidesProgress: true,
	})

	const swiperMain = new Swiper(swiperMainElement, {
    modules: [ EffectFade, Thumbs ],
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    slidesPerView: 1,
    navigation: {
      prevEl: swiperPrev,
      nextEl: swiperNext,
    },
    pagination: {
      el: swiperPagination,
      type: 'bullets',
      clickable: true,
    },
    thumbs: {
      swiper: swiperThumb,
    },
	})
})
