class MenuCreator {
  /**
   * @param {Element|string} root – корневой элемент меню или селектор (например, '[data-create-menu]')
   */
  constructor(root) {
    this.rootElement = typeof root === 'string' ? document.querySelector(root) : root
    this.menuContainer = null   // Контейнер меню
  }

  /**
   * Инициализация: парсинг исходного списка и построение нового меню.
   */
  init() {
    if (!this.rootElement) {
      console.error("Корневой элемент меню не найден")
      return
    }
    // Парсим исходную структуру в виде дерева объектов
    const tree = this.parseList(this.rootElement)

    // Создаём контейнер нового меню
    const menuContainer = document.createElement("div")
    menuContainer.classList.add("menu")
    this.menuContainer = menuContainer

    // Создаём .container, который будет содержать колонки меню
    const container = document.createElement("div")
    container.classList.add("container")

    // Построение колонок по уровням вложенности
    // Начинаем с группы верхнего уровня: parentId === null
    let groups = [{ parentId: null, nodes: tree }]

    while (groups.length > 0) {
      // Создаём колонку для текущего уровня
      const colDiv = document.createElement("div")
      colDiv.classList.add("menu-col")

      groups.forEach((group) => {
        const ul = document.createElement("ul")

        // Если группа привязана к какому-либо родителю, добавляем data-атрибут
        if (group.parentId) {
          ul.setAttribute("data-create-menu-related", group.parentId)

          // Получаем родительский элемент, который открыл этот список
          setTimeout(() => {
            const parentButton = document.querySelector(`[data-create-menu-target="${group.parentId}"]`)
            if (!parentButton) return

            ul.prepend(
              Object.assign(document.createElement("li"), {
                innerHTML: `
                  <button class="btn btn-close"
                    data-create-menu-close="${group.parentId}">
                    <span class="icon">
                      <svg>
                        <use xlink:href="img/icons/arrow-left.svg#svg-arrow-left"></use>
                      </svg>
                    </span>
                    <span class="text">
                      ${parentButton.textContent.trim()}
                    </span>
                  </button>
                `,
              })
            )
          }, 100)
        } else {
          ul.prepend(
            Object.assign(document.createElement("li"), {
              innerHTML: `
                <button type="button" class="btn btn-close"
                  data-bs-dismiss="dropdown">
                  <span class="icon">
                    <svg>
                      <use xlink:href="img/icons/arrow-left.svg#svg-arrow-left"></use>
                    </svg>
                  </span>
                  <span class="text">
                    Каталог
                  </span>
                </button>
              `,
            })
          )
        }

        group.nodes.forEach((node) => {
          const li = document.createElement("li")
          const clickableElement = Object.assign(document.createElement(node.link ? "a" : "button"), {
            href: node.link || undefined,
            className: 'btn hover-underline',
            innerHTML: node.link
              ? `<span class="text">${node.html}</span>`
              : `
                <span class="text">${node.html}</span>
                <span class="icon">
                  <svg>
                    <use xlink:href="img/icons/arrow-right.svg#svg-arrow-right"></use>
                  </svg>
                </span>
              `,
          })

          if (node.img) {
            clickableElement.setAttribute("data-create-menu-img", node.img)
          }

          if (node.children && node.children.length > 0 && node.id) {
            clickableElement.setAttribute("data-create-menu-target", node.id)
          } else {
            clickableElement.setAttribute("data-create-menu-target", '')
          }

          li.appendChild(clickableElement)
          ul.appendChild(li)
        })

        colDiv.appendChild(ul)
      })
      container.appendChild(colDiv)

      // Готовим группы для следующего уровня – собираем дочерние элементы узлов, у которых есть дети
      let nextGroups = []
      groups.forEach((group) => {
        group.nodes.forEach((node) => {
          if (node.children && node.children.length > 0 && node.id) {
            nextGroups.push({ parentId: node.id, nodes: node.children })
          }
        })
      })
      groups = nextGroups
    }

    container.appendChild(
      Object.assign(document.createElement("div"), {
        className: 'menu-col',
        innerHTML: `
          <img loading="lazy" src="" class="image is-hidden" alt="Фото">
        `,
      })
    )

    // Добавляем .container в menuContainer
    menuContainer.appendChild(container)

    // Заменяем исходное меню на новое
    this.rootElement.parentNode.replaceChild(menuContainer, this.rootElement)

    this.initEventListeners()
  }

  /**
   * Рекурсивный парсинг исходного списка <ul> в дерево объектов.
   * Каждый объект имеет поля:
   *  - text: текст ссылки,
   *  - img: значение data-create-menu-img,
   *  - id: сгенерированный идентификатор (если есть дочерние элементы),
   *  - children: массив дочерних узлов.
   *
   * @param {Element} ulElement – текущий ul для парсинга
   * @param {string} parentId – id родительского элемента (для формирования нового id)
   * @returns {Array} массив объектов-пунктов
   */
  parseList(ulElement, parentId = "") {
    const nodes = []

    // Отбираем только элементы <li>
    const liElements = Array.from(ulElement.children).filter(
      (el) => el.tagName.toLowerCase() === "li"
    )

    liElements.forEach((li, index) => {
      const clickableElement = li.querySelector("a, button")
      if (!clickableElement) return

      const node = {
        link: clickableElement.tagName.toLowerCase() === "a" ? clickableElement.getAttribute("href") || "" : null,
        html: clickableElement.innerHTML.trim(),
        img: clickableElement.getAttribute("data-create-menu-img") || "",
        children: [],
      }

      // Если в <li> есть вложенный <ul>, обрабатываем его
      const nestedUl = li.querySelector("ul")
      if (nestedUl) {
        // Генерируем id на основе родительского id и порядкового номера
        node.id = parentId ? `${parentId}-${index + 1}` : `${index + 1}`
        node.children = this.parseList(nestedUl, node.id)
      }

      nodes.push(node)
    })
    return nodes
  }

  /**
    * Инициализация слушателей событий в зависимости от ширины экрана.
    */
  initEventListeners() {
    const breakpoint = 992
    const menuContainer = this.menuContainer
    const menuListeners = ["mouseover", "click"]

    if (!menuContainer) {
      console.error("Контейнер меню не найден")
      return
    }

    // Сохраняем this для использования в обработчиках событий
    const self = this

    menuListeners.forEach((eventType) => {

      menuContainer.addEventListener(eventType, e => {

        switch (eventType) {
          case "mouseover":
            if (window.innerWidth > breakpoint) {
              const targetButton = e.target.closest("[data-create-menu-target]")
              if (targetButton && !targetButton.classList.contains('is-active')) {
                self.handleMouseEnter(targetButton)
              }
            }

            break

          case "click":
            if (window.innerWidth <= breakpoint) {
              const targetButton = e.target.closest("[data-create-menu-target]")
              if (targetButton) {
                self.handleClick(targetButton)
              }

              const closeButton = e.target.closest("[data-create-menu-close]");
              if (closeButton) {
                const parentId = closeButton.getAttribute("data-create-menu-close");
                this.closeMenuCols(parentId, true)
                this.removeTargetActiveClasses()
                this.updateMenuCols()
              }
            }

            break
        }
      })
    })
  }

  /**
   * Обработчик наведения мыши для выбора пункта меню.
   */
  handleMouseEnter(target) {
    this.handleInteraction(target)
  }

  /**
   * Обработчик события клика.
   */
  handleClick(target) {
    this.handleInteraction(target, true)
  }

  handleInteraction(target, hasDelay = false) {
    const parentUl = target.closest("ul")
    if (parentUl) {
      parentUl.querySelectorAll("[data-create-menu-target]").forEach(sibling => {
        if (sibling !== target) {
          this.closeMenuCols(sibling.getAttribute("data-create-menu-target"), hasDelay)
          sibling.classList.remove("is-active")
        }
      })
    }

    target.tagName === "BUTTON" && target.classList.add("is-active")
    this.updateImageSrc(target)
    this.updateMenuCol(target)
    this.updateMenuCols()
  }

  /**
   * Обновляет класс is-show у ul
   */
  updateMenuCol(target) {
    document.querySelectorAll(`[data-create-menu-related="${target.getAttribute("data-create-menu-target")}"]`)?.forEach(el => {
      const menuCol = el.closest('.menu-col')

      menuCol.classList.contains('is-show') && menuCol.classList.remove('is-show')

      el.classList.add("is-show")
    })
  }

  /**
   * Обновляет класс is-show у .menu-col, если внутри есть ul.is-show
   */
  updateMenuCols() {
    this.menuContainer.querySelectorAll(".menu-col").forEach((col) => {
      setTimeout(() => {
        if (col.querySelector("ul.is-show") !== null) {
          col.classList.add("is-show")
        } else {
          col.classList.remove("is-show")
        }
      }, 300)
    })
  }

  /**
   * Закрывает все вложенные подменю начиная с определённого уровня
   * @param {string} parentId - id родителя, начиная с которого скрывать меню
   */
  closeMenuCols(parentId, hasDelay = false) {
    document.querySelectorAll(`[data-create-menu-related^="${parentId}"]`)?.forEach(menu => {
      hasDelay ? setTimeout(() => menu.classList.remove("is-show"), 300) : menu.classList.remove("is-show")

      menu.querySelectorAll("[data-create-menu-target]").forEach(target => {
        target.classList.remove("is-active")
      })
    })
  }

  /**
   * Обновляет изображение в последней колонке меню.
   */
  updateImageSrc(target) {
    const imgSrc = target.getAttribute("data-create-menu-img")
    const imgElement = this.menuContainer.querySelector(".menu-col img")
    if (imgElement) {
      imgElement.setAttribute("src", imgSrc)
      imgElement.classList.remove('is-hidden')
    }
  }

  /**
   * Cбрасывает изображение в последней колонке меню.
   */
  removeImageSrc() {
    const imgElement = this.menuContainer.querySelector(".menu-col img")
    if (imgElement) {
      imgElement.setAttribute("src", "")
      imgElement.classList.add('is-hidden')
    }
  }

  /**
   * Cбрасывает class is-active у кнопок/ссылок.
   */
  removeTargetActiveClasses() {
    document.querySelectorAll('[data-create-menu-target].is-active')?.forEach(target => target.classList.remove('is-active'))
  }

  /**
   * Добавляем глобальный обработчик событий для закрытия меню
   */
  resetAll() {
    document.addEventListener('mousemove', (e) => {
      if (this.menuContainer && !this.menuContainer.contains(e.target)) {
        // Закрываем все открытые подменю
        const openMenus = document.querySelectorAll('[data-create-menu-related].is-show')
        openMenus.forEach(menu => menu.classList.remove('is-show'))

        this.removeTargetActiveClasses()
        this.updateMenuCols()
        this.removeImageSrc()
      }
    })
  }
}

new MenuCreator("[data-create-menu]").init()
