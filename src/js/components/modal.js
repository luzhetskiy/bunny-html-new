import Modal from 'bootstrap/js/dist/modal.js'

window.modalInstances = new Map()

window.initializeModal = function (element) {
  const modal = new Modal(element)
  modalInstances.set(element, modal)
}

document.querySelectorAll('.modal')?.forEach((element) => {
  initializeModal(element)
})

document.body.addEventListener('click', (event) => {
  const target = event.target

  if (target.getAttribute('data-bs-toggle') === 'modal') {
    const targetElement = document.querySelector(target.getAttribute('data-bs-target'))

    if (!modalInstances.has(targetElement)) {
      initializeModal(targetElement)
    }

    modalInstances.get(targetElement).show()
  }

  const closestTarget = event.target.closest('[data-bs-toggle="modal"][data-stories-index]')
  if (closestTarget) {
    const modalElement = document.querySelector(closestTarget.getAttribute('data-bs-target'))
    const storiesIndex = closestTarget.getAttribute('data-stories-index').replace(/[^0-9]/g, '')

    modalInstances.get(modalElement).show()

    modalElement.addEventListener('shown.bs.modal', () => {
      const swiperStories = document.querySelector('.swiper-stories').swiper

      swiperStories.slideTo(storiesIndex - 1)
    })
  }
})

// const modalElement = document.querySelector('#modalAgeRestriction')
// modalElement && modalInstances.get(modalElement)?.show()
