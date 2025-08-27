window.handleToggleDismiss = function(value) {
  const toggleBtn = document.querySelector(`[data-toggle="${value}"]`)
  if (toggleBtn) {
    toggleBtn.classList.remove("is-active")

    value === 'search' && toggleBtn.classList.remove("visually-hidden")
  }

  const targetSelector = toggleBtn?.dataset.target
  if (targetSelector) {
    const targetEl = document.querySelector(targetSelector)
    if (targetEl) {
      targetEl.classList.remove("is-show")
    }
  }
}

window.handleToggleShow = function(value) {
  const toggleBtn = document.querySelector(`[data-toggle="${value}"]`)
  if (toggleBtn) {
    toggleBtn.classList.add("is-active")

    if (value === "search") {
      toggleBtn.classList.add("visually-hidden")
    }
  }

  const targetSelector = toggleBtn?.dataset.target
  if (targetSelector) {
    const targetEl = document.querySelector(targetSelector)
    if (targetEl) {
      targetEl.classList.add("is-show")
    }
  }
}

document.querySelectorAll("[data-toggle]").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const toggleValue = toggle.dataset.toggle

    handleToggleShow(toggleValue)
  })
})

document.querySelectorAll("[data-dismiss]").forEach(dismiss => {
  dismiss.addEventListener("click", () => {
    const dismissValue = dismiss.dataset.dismiss

    handleToggleDismiss(dismissValue)
  })
})
