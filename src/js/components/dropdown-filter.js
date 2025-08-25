document.querySelectorAll('[data-dropdown-filter]')?.forEach(dropdown => {
  const hiddenInput = dropdown.querySelector('input[type="hidden"]')
  const displaySpan = dropdown.querySelector('[data-choice-changed]')
  const radios = dropdown.querySelectorAll('input[type="radio"]')

  const updateDisplay = (radio) => {
    const label = radio.closest('label')?.querySelector('.field-radio-label')?.textContent.trim() || ''
    displaySpan.textContent = label
    hiddenInput.value = radio.value
  }

  const checkedRadio = dropdown.querySelector('input[type="radio"]:checked')
  if (checkedRadio) updateDisplay(checkedRadio)

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        updateDisplay(radio)
      }
    })
  })
})
