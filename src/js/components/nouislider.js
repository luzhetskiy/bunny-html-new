import noUiSlider from 'nouislider'

document.querySelectorAll('[data-nouislider]')?.forEach(wrapper => {
  const sliderEl = wrapper.querySelector('[data-nouislider-element]')
  const inputMin = wrapper.querySelector('input[name="price-min"]')
  const inputMax = wrapper.querySelector('input[name="price-max"]')

  const min = parseInt(inputMin.getAttribute('min')) || 0
  const max = parseInt(inputMax.getAttribute('max')) || 10000
  const marginValue = ((max - min) * 5) / 100

  noUiSlider.create(sliderEl, {
    start: [min, max],
    connect: true,
    range: {
      'min': min,
      'max': max
    },
    step: 50,
    margin: marginValue
  })

  sliderEl.noUiSlider.on('update', (values, handle) => {
    const value = Math.round(values[handle])
    if (handle === 0) {
      inputMin.value = value
    } else {
      inputMax.value = value
    }
  })

  function setSliderFromInput(input, handleIndex) {
    let val = parseInt(input.value)
    if (isNaN(val)) val = handleIndex === 0 ? min : max
    if (val < min) val = min
    if (val > max) val = max

    sliderEl.noUiSlider.set(handleIndex === 0 ? [val, null] : [null, val])
  }

  inputMin.addEventListener('change', () => setSliderFromInput(inputMin, 0))
  inputMax.addEventListener('change', () => setSliderFromInput(inputMax, 1))

  inputMin.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setSliderFromInput(inputMin, 0)
    }
  })

  inputMax.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setSliderFromInput(inputMax, 1)
    }
  })
})
