import { getHeaderHeight } from '../functions/header-height.js'
import { throttle } from '../functions/throttle.js';

const header = document.querySelector('.header')

const headerTopHeight = () => {
  document.documentElement.style.setProperty('--header-top-height', `${header.offsetHeight}px`)
}

if (header) {
  headerTopHeight()
  getHeaderHeight()
  window.addEventListener('resize', throttle(headerTopHeight))
  window.addEventListener('resize', throttle(getHeaderHeight))
}
