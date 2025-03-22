import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
Swiper.use([Navigation, Pagination])

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

document.querySelectorAll('.hero-swiper')?.forEach((element) => {
  const swiperElement = element.querySelector('.swiper')
  const swiperPagination = element.querySelector('.swiper-pagination')
  const swiperPrev = element.querySelector('.swiper-button-prev')
  const swiperNext = element.querySelector('.swiper-button-next')

  const swiper = new Swiper(swiperElement, {
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
  })
})


document.querySelectorAll('.new-arrivals-swiper')?.forEach((element) => {
  const swiperElement = element.querySelector('.swiper')

  const swiper = new Swiper(swiperElement, {
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
  })
})

document.querySelectorAll('.cards-swiper')?.forEach((element) => {
  const swiperElement = element.querySelector('.swiper')
  const swiperPrev = element.querySelector('.swiper-button-prev')
  const swiperNext = element.querySelector('.swiper-button-next')

  const swiper = new Swiper(swiperElement, {
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
  })
})

document.querySelectorAll('.swiper-card-pictures')?.forEach((swiperElement) => {
  const swiperPagination = swiperElement.querySelector('.swiper-pagination')

  let isTouchScreen = window.matchMedia('(hover: none)').matches

  const swiperCardImage = new Swiper(swiperElement, {
    slidesPerView: 1,
    nested: true,

    loop: isTouchScreen,

    pagination: {
      el: swiperPagination,
      type: 'bullets',
      clickable: true,
    },

    on: {
      init: function() {
        const swiper = this
        const slides = swiper.slides

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
            swiperCardImage.slideTo(index)
            swiperPagination.querySelectorAll('.swiper-pagination-bullet')[index].click()
          })
        })

        swiper.el.addEventListener('mouseleave', () => {
          swiperCardImage.slideTo(0)
          swiperPagination.querySelectorAll('.swiper-pagination-bullet')[0].click()
        })
      },
    },
  })
})

document.querySelectorAll('.articles-swiper')?.forEach((element) => {
  const swiperElement = element.querySelector('.swiper')

  const swiper = new Swiper(swiperElement, {
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
  })
})
