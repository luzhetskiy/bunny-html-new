import Dropdown from 'bootstrap/js/dist/dropdown.js'

window.dropdownInstances = new Map()

window.initializeDropdown = function (element) {
	const dropdown = new Dropdown(element)
	dropdownInstances.set(element, dropdown)
}

document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((element) => {
	initializeDropdown(element)
})

document.body.addEventListener('click', (event) => {
  // Ищем ближайший элемент-тогглер dropdown
  const targetToggle = event.target.closest('[data-bs-toggle="dropdown"]')
  const targetClose = event.target.closest('[data-bs-dismiss="dropdown"]')
  // Проверяем, кликнули ли мы внутри dropdown-menu
  const clickedInsideMenu = event.target.closest('.dropdown-menu')

  if (targetClose) {
    const parentDropdown = targetClose.closest('.dropdown')
    if (parentDropdown) {
      // Ищем внутри него элемент-тогглер dropdown
      const toggle = parentDropdown.querySelector('[data-bs-toggle="dropdown"]')
      if (toggle && dropdownInstances.has(toggle)) {
        // Закрываем dropdown

        dropdownInstances.get(toggle).hide()
      }
    }
  }

  if (targetToggle) {
    // Если для текущего элемента ещё не создан инстанс, создаём его
    if (!dropdownInstances.has(targetToggle)) {
      initializeDropdown(targetToggle)
    }

    // Закрываем все dropdown, кроме того, по которому кликнули
    dropdownInstances.forEach((dropdownInstance, element) => {
      if (element !== targetToggle) {
        dropdownInstance.hide()
      }
    })

    // Переключаем состояние текущего dropdown
    dropdownInstances.get(targetToggle).toggle()
  } else if (clickedInsideMenu) {
    // Если клик внутри меню, проверяем, нужно ли закрывать dropdown
    // Определяем родительский dropdown, которому принадлежит меню
    const parentDropdown = event.target.closest('.dropdown')
    if (parentDropdown) {
      // Ищем элемент-тогглер внутри родительского dropdown
      const toggle = parentDropdown.querySelector('[data-bs-toggle="dropdown"]')
      // Если установлен data-bs-auto-close="outside", то не закрываем dropdown
      if (toggle && toggle.getAttribute('data-bs-auto-close') === 'outside') {
        return
      }
    }
    // Если условие не выполнено — закрываем все dropdown
    dropdownInstances.forEach((dropdownInstance) => {
      dropdownInstance.hide()
    })
  }
})
