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
