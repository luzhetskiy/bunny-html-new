import IMask from 'imask'

document.querySelectorAll('label.field').forEach(field => {
  const input = field.querySelector('input, textarea')
  if (!input) return

  input.addEventListener('focus', () => {
    field.classList.add('is-focus')
  })

  // При потере фокуса — убираем класс,
  // но только если фокус ушёл из всего блока `label.field`
  input.addEventListener('blur', (event) => {
    // Небольшая задержка, чтобы успеть поймать фокус кнопок внутри postfix
    setTimeout(() => {
      if (!field.contains(document.activeElement)) {
        field.classList.remove('is-focus')
      }
    }, 0)
  })
})


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

document.querySelectorAll('input[type="tel"]')?.forEach(input => {
  IMask(input, {
    mask: '+{7} (000) 000-00-00'
  })
})

document.querySelectorAll('[data-toggle="password"]')?.forEach((control) => {
  const targetSelector = control.dataset.target
  const targetEl = document.querySelector(targetSelector)
  const toggleReveal = control.querySelector('[data-toggle="reveal"]')

  const mainPassword = control.querySelector('input')
  const repeatPassword = targetEl?.querySelector('input')

  toggleReveal.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    const isPassword = mainPassword.type === 'password'

    if (isPassword) {
      mainPassword.type = 'text'
      if (repeatPassword) repeatPassword.type = 'text'
      toggleReveal.classList.add('is-active')
    } else {
      mainPassword.type = 'password'
      if (repeatPassword) repeatPassword.type = 'password'
      toggleReveal.classList.remove('is-active')
    }

    mainPassword.focus({ preventScroll: true })
  })
})

document.querySelectorAll('[data-toggle="pin-code"]')?.forEach((element) => {
  const inputs = element.querySelectorAll('input.field')

  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      // Разрешаем только цифры
      const value = e.target.value.replace(/\D/g, '')
      e.target.value = value

      // Если введена цифра — фокус на следующий input
      if (value && index < inputs.length - 1) {
        inputs[index + 1].focus()
      }

      // Когда все поля заполнены — собираем код
      if ([...inputs].every(i => i.value)) {
        const code = Array.from(inputs).map(i => i.value).join('')
        console.log('Код:', code)
      }
    })

    input.addEventListener('keydown', (e) => {
      // При Backspace — переход на предыдущий input
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus()
      }

      // При стрелке влево/вправо — переход по полям
      if (e.key === 'ArrowLeft' && index > 0) {
        inputs[index - 1].focus()
      }
      if (e.key === 'ArrowRight' && index < inputs.length - 1) {
        inputs[index + 1].focus()
      }
    })
  })
})
