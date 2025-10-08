window.closeAlert = function () {
  const alert = this.closest('.alert')
  if (!alert) return

  alert.classList.remove('is-show')
  alert.addEventListener('transitionend', () => {
    alert.remove()
  }, { once: true })
}

window.showAlert = function (text, type = 'info', duration = 5000) {
  const alertContainer = document.querySelector('.alert-container')
  if (!alertContainer) return

  const alert = document.createElement('div')
  alert.className = `alert alert-${type}`
  alert.innerHTML = `
    <div class="alert-body">
      <div class="alert-content">
        <p>${text}</p>
      </div>
      ${type === 'error' ? (
      `
          <button type="button" class="btn alert-close" onclick="window.closeAlert.call(this)">
            <span class="icon">
              <svg>
                <use xlink:href="img/icons/close.svg#svg-close"></use>
              </svg>
            </span>
          </button>
        `
    ) : ''}
    </div>
  `

  alertContainer.appendChild(alert)

  requestAnimationFrame(() => {
    alert.classList.add('is-show')
  })

  setTimeout(() => {
    alert.classList.remove('is-show')
    alert.addEventListener('transitionend', () => {
      alert.remove()
    }, { once: true })
  }, duration)
}
