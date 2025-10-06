import Tooltip from 'bootstrap/js/dist/tooltip.js'

window.tooltipInstances = new Map()

window.initializeTooltip = function (element) {
  const tooltip = new Tooltip(element, {
    html: true,
    offset: [0, 12]
  })
  tooltipInstances.set(element, tooltip)
}

document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
	initializeTooltip(element)
})
