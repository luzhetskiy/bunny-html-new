import Tab from 'bootstrap/js/dist/tab.js'

window.tabInstances = new Map()

window.initializeTab = function (element) {
	const tab = new Tab(element)
	window.tabInstances.set(element, tab)
}

document.querySelectorAll('[data-bs-toggle="tab"], [data-bs-toggle="pill"]')?.forEach(button => {
	window.initializeTab(button)

	button.addEventListener('click', event => {
		event.preventDefault()

		const instance = window.tabInstances.get(button)
		instance?.show()
	})
})
