import Choices from 'choices.js'

document.querySelectorAll('[data-choices]')?.forEach(el => {
  const type = el.dataset.choices

  const config = {
    searchEnabled: false,
    shouldSort: false,
    resetScrollPosition: false,
    renderSelectedChoices: 'always',
    itemSelectText: '',
    loadingText: 'Загрузка...',
    noResultsText: 'Ничего не найдено',
  }

  switch (type) {
    case 'choices--secondary':
      Object.assign(config, {
        removeItemButton: false,
        classNames: {
          containerOuter: ['choices', 'choices--secondary']
        },
        callbackOnCreateTemplates: (strToEl, escapeForTemplate, getClassNames) => {
          return {
            containerInner: ({ classNames }) => {
              return strToEl(`
                <div class="${getClassNames(classNames.containerInner).join(' ')}">
                  <span class="icon ${getClassNames(classNames.list).join(' ') + '-icon'}" >
                    <svg>
                      <use xlink:href="img/icons/arrow-down.svg#svg-arrow-down"></use>
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
      })
      break
  }

  const choice = new Choices(el, config)
  const containerInner = choice.containerInner.element
})
