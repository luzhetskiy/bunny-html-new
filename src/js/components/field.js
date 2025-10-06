document.querySelectorAll('.field-wrapper')?.forEach((element) => {
  const input = element.querySelector('input')

  if (!input) return

  const toggleClass = () => {
    if (input.value.trim() !== '') {
      element.classList.add('is-input')
    } else {
      element.classList.remove('is-input')
    }
  }

  toggleClass()

  input.addEventListener('input', toggleClass)
})

document.querySelectorAll('.field-radio')?.forEach((element) => {
  const input = element.querySelector('input')

  if (!input) return

  if (input.checked) {
    element.classList.add('is-checked')
  }

  input.addEventListener('change', () => {
    if (input.type === 'radio') {
      document.querySelectorAll(`input[name="${input.name}"]`).forEach(otherInput => {
        otherInput.closest('.field-radio')?.classList.remove('is-checked')
      })
    }

    if (input.checked) {
      element.classList.add('is-checked')
    } else {
      element.classList.remove('is-checked')
    }
  })
})

