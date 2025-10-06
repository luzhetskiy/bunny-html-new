import Collapse from 'bootstrap/js/dist/collapse.js'

window.handleToggleDismiss = function (value) {
  const toggleBtn = document.querySelector(`[data-toggle="${value}"]`)
  const targetSelector = toggleBtn?.dataset.target

  if (toggleBtn) {
    toggleBtn.classList.remove("is-active")

    if (value === 'search') {
      toggleBtn.classList.remove("visually-hidden")

      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector)
        if (targetEl) {
          targetEl.classList.remove("is-show")
        }
      }
    }
  }
}

window.handleToggleShow = function (value) {
  const toggleBtn = document.querySelector(`[data-toggle="${value}"]`)
  const targetSelector = toggleBtn?.dataset.target

  if (toggleBtn) {
    toggleBtn.classList.add("is-active")

    if (value === "search") {
      toggleBtn.classList.add("visually-hidden")

      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector)
        if (targetEl) {
          targetEl.classList.add("is-show")
        }
      }
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

document.querySelectorAll('input[data-toggle="radio-collapse"]')?.forEach(input => {
  const targetSelector = input.dataset.target
  const targetEl = document.querySelector(targetSelector)

  if (!targetEl) return

  if (!targetEl._collapseInstance) {
    targetEl._collapseInstance = new Collapse(targetEl, { toggle: false })
  }

  const collapse = targetEl._collapseInstance

  if (input.checked) {
    collapse.show()
  } else {
    collapse.hide()
  }

  input.addEventListener('change', () => {
    const allInputs = document.querySelectorAll('input[data-toggle="radio-collapse"]')
    allInputs.forEach(el => el.disabled = true)

    const unlock = () => {
      allInputs.forEach(el => el.disabled = false)
    }

    targetEl.addEventListener('shown.bs.collapse', unlock, { once: true })
    targetEl.addEventListener('hidden.bs.collapse', unlock, { once: true })

    if (input.type === 'radio') {
      document.querySelectorAll(`input[name="${input.name}"][data-toggle="radio-collapse"]`)
        .forEach(otherInput => {
          if (otherInput !== input) {
            const otherTarget = document.querySelector(otherInput.dataset.target)
            if (otherTarget && otherTarget._collapseInstance) {
              otherTarget._collapseInstance.hide()
            }
          }
        })
    }

    if (input.checked) {
      collapse.show()
    } else {
      collapse.hide()
    }
  })
})
