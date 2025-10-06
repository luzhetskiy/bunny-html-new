import Choices from 'choices.js'

document.querySelectorAll('[data-choices]')?.forEach(el => {
  const type = el.dataset.choices
  const optionsCount = el.querySelectorAll('option').length

  const config = {
    searchEnabled: optionsCount > 12,
    shouldSort: false,
    resetScrollPosition: false,
    renderSelectedChoices: 'always',
    itemSelectText: '',
    loadingText: 'Загрузка...',
    noResultsText: 'Ничего не найдено',
    callbackOnCreateTemplates: (strToEl, escapeForTemplate, getClassNames) => {
      return {
        containerInner: ({ classNames }) => {
          const isTime = type === 'choices--time'
          const iconName = isTime ? 'clock' : 'arrow-down'
          const extraClass = isTime ? '' : `${getClassNames(classNames.list).join(' ')}-icon`

          return strToEl(`
            <div class="${getClassNames(classNames.containerInner).join(' ')}">
              <span class="icon ${extraClass}" >
                <svg>
                  <use xlink:href="img/icons/${iconName}.svg#svg-${iconName}"></use>
                </svg>
              </span>
            </div>
          `)
        },
        item: ({ classNames }, data) => {
          return strToEl(`
            <div class="${getClassNames(classNames.item).join(' ')}
              ${
                getClassNames(data.highlighted
                  ? classNames.highlightedState
                  : classNames.itemSelectable).join(' ')
              }
              ${
                data.placeholder ? classNames.placeholder : ''
              }"
              data-item
              data-id="${data.id}"
              data-value="${data.value}"
              ${data.disabled ? 'aria-disabled="true"' : ''}
              ${data.active ? 'aria-selected="true"' : ''}>
              ${data.label}
            </div>
          `)
        },
        choice: ({ classNames }, data) => {
          return strToEl(`
            <div class="${getClassNames(classNames.item).join(' ')}
              ${getClassNames(classNames.itemChoice).join(' ')}
              ${
                getClassNames(data.disabled
                  ? classNames.itemDisabled
                  : classNames.itemSelectable).join(' ')
              }
              ${data.placeholder ? 'visually-hidden': ''}"
              ${config.itemSelectText ? `data-select-text="${config.itemSelectText}"` : ''}
              data-choice ${
                data.disabled
                  ? 'data-choice-disabled aria-disabled="true"'
                  : 'data-choice-selectable'
              }
              data-id="${data.id}"
              data-value="${data.value}"
              ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}>
              ${data.label}
            </div>
          `)
        }
      }
    }
  }

  switch (type) {
    case 'choices--filter':
      Object.assign(config, {
        removeItemButton: false,
        classNames: {
          containerOuter: ['choices', 'choices--filter']
        },
      })
      break
  }

  const choice = new Choices(el, config)
  const containerInner = choice.containerInner.element
})
