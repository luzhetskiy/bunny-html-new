import { getHeaderHeight } from '../functions/header-height.js'
import { throttle } from '../functions/throttle.js';


const headerTopHeight = () => {
  const header = document.querySelector('.header')
  header && document.documentElement.style.setProperty('--header-top-height', `${header.offsetHeight}px`)
}

headerTopHeight()
getHeaderHeight()
window.addEventListener('resize', throttle(headerTopHeight))
window.addEventListener('resize', throttle(getHeaderHeight))
