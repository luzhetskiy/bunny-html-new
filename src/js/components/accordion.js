import Collapse from 'bootstrap/js/dist/collapse.js'

window.collapseInstances = new Map()

window.initializeCollapse = function (element) {
	const collapse = new Collapse(element, { toggle: false })
	window.collapseInstances.set(element, collapse)
}

document.querySelectorAll('[data-bs-toggle="collapse"]')?.forEach(button => {
	const targetSelector = button.getAttribute('data-bs-target')
	const collapseElement = document.querySelector(targetSelector)

	if (collapseElement) {
		window.initializeCollapse(collapseElement)

		button.addEventListener('click', event => {
			event.preventDefault()

			const parentId = collapseElement.getAttribute('data-bs-parent')
			if (parentId) {
				const parentElement = document.getElementById(parentId)
				if (parentElement) {
					parentElement.querySelectorAll('.accordion-collapse.show').forEach(openElement => {
						if (openElement !== collapseElement) {
							const instance = window.collapseInstances.get(openElement)
							instance?.hide()
						}
					})
				}
			}

			const instance = window.collapseInstances.get(collapseElement)
			instance?.toggle()
		})
	}
})