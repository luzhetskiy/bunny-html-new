import { Calendar } from 'vanilla-calendar-pro'
import { getDateString } from 'vanilla-calendar-pro/utils'

/** Преобразует любое входное значение в ISO 'YYYY-MM-DD' через getDateString,
 *  затем в 'DD.MM.YYYY' */
function isoToDisplay(value) {
  if (!value && value !== 0) return ''

  // Преобразуем value в Date корректно:
  // если это уже Date — используем, если число — new Date(number), если строка — new Date(string)
  const date = (value instanceof Date) ? value : new Date(value)

  // getDateString вернёт 'YYYY-MM-DD'
  const iso = getDateString(date)
  if (!iso) return ''

  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

/** Форматирует выбранное значение. Поддерживает:
 *  - строку 'YYYY-MM-DD'
 *  - диапазон 'YYYY-MM-DD:YYYY-MM-DD'
 *  - timestamp (number)
 *  - Date
 *  - массив (selectedDates) */
function formatSelected(selected) {
  if (!selected) return ''

  // если передали массив (self.context.selectedDates)
  if (Array.isArray(selected)) {
    if (selected.length === 0) return ''
    // Если нужно показывать только первую запись, можно взять selected[0].
    // Если нужно отобразить диапазон/несколько — адаптируй логику.
    // Тут мы обработаем оба случая: если first содержит ':', то распарсим диапазон.
    return formatSelected(selected[0])
  }

  // строка-диапазон
  if (typeof selected === 'string' && selected.includes(':')) {
    return selected.split(':').map(iso => isoToDisplay(iso)).join(' – ')
  }

  // одиночная дата (string/number/Date)
  return isoToDisplay(selected)
}

/** Возвращает дату завтра в формате 'YYYY-MM-DD' */
function getTomorrowDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const yyyy = tomorrow.getFullYear()
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const dd = String(tomorrow.getDate()).padStart(2, '0')

  return `${yyyy}-${mm}-${dd}`
}

document.querySelectorAll('[data-calendar]')?.forEach(el => {
  const type = el.dataset.calendar

  const setDates = () => {
    if (type === 'select') {
      const input = el.closest('.dropdown--select')?.querySelector('input[name="date"]')
      if (input?.value) {
        // если значение — одна дата (2025-10-04)
        if (!input.value.includes(':')) {
          return [input.value]
        }

        return [input.value]
      }
    }
    return []
  }

  const upadteDates = (value) => {
    if (type === 'select') {
      const input = el.closest('.dropdown--select')?.querySelector('input[name="date"]')
      const dropdownToggle = el.closest('.dropdown--select')?.querySelector('.dropdown-toggle')
      const dropdownToggleValue = dropdownToggle?.querySelector('.text')

      const display = value?.context?.selectedDates
        ? formatSelected(value.context.selectedDates)
        : formatSelected(value)

      if (display) {
        dropdownToggle?.classList.remove('is-placeholder')
        if (dropdownToggleValue) dropdownToggleValue.textContent = display
        if (input) input.value = display
      } else {
        dropdownToggle?.classList.add('is-placeholder')
        if (dropdownToggleValue) dropdownToggleValue.textContent = 'Дата доставки'
        if (input) input.value = null
      }
    }
  }

  const calendar = new Calendar(el, {
    locale: 'ru',
    selectedTheme: 'light',
    displayDateMin: getTomorrowDate(),
    displayDatesOutside: false,
    disableToday: true,
    selectedDates: setDates(),
    selectionDatesMode: 'single',
    onInit(self) {
      upadteDates(setDates())
    },
    onClickDate(self, event) {
      upadteDates(self)

      if (type === 'select') {
        const dropdownElement = el.closest('.dropdown').querySelector('[data-bs-toggle="dropdown"]')

        if (dropdownElement) {
          const dropdownInstance = window.dropdownInstances.get(dropdownElement)
          if (dropdownInstance) {
            (self.context.selectedDates.length > 0) && dropdownInstance.hide()
          }
        }
      }
    },
    layouts: {
      default: `
        <div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation">
          <div class="vc-header__content" data-vc-header="content">
            <#Year /> <#Month />
          </div>
          <#ArrowPrev />
          <#ArrowNext />
        </div>
        <div class="vc-wrapper" data-vc="wrapper">
          <#WeekNumbers />
          <div class="vc-content" data-vc="content">
            <#Dates />
            <#Week />
            <#DateRangeTooltip />
          </div>
        </div>
        <#ControlTime />
      `
    }
  })

  calendar.init()
})
