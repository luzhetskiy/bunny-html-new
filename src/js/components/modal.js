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

  target.hasAttribute('data-success') && localStorage.setItem('hideModal', 'true')
})

if (localStorage.getItem('hideModal') === 'false') {
  const modalElement = document.querySelector('#modalAgeRestriction')
  modalElement && modalInstances.get(modalElement)?.show()
}
