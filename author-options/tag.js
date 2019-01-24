class AuthorOptionsElement extends HTMLElement {
  constructor () {
    super()

    this.UTIL.defineProperties({
      cherryPicked: {
        private: true
      },

      form: {
        readonly: true,
        get: () => this.parentNode.form
      },

      displayOptions: {
        readonly: true,
        get: () => {
          let AuthorHTMLOptionsCollection = this.PRIVATE.generateAuthorHTMLOptionsCollectionConstructor()
          let array = this.options.map(option => option.displayElement)
          let addFunction = (element, before) => this.addOption(this.PRIVATE.generateOptionObject(element), before)
          let removeFunction = index => this.removeOptionByIndex(index)
          return new AuthorHTMLOptionsCollection(array, this.selectedIndex, addFunction, removeFunction)
        }
      },

      hoveredIndex: {
        readonly: true,
        get: () => this.options.findIndex(option => option.displayElement.hover)
      },

      lastSelectedIndex: {
        private: true
      },

      multiple: {
        readonly: true,
        get: () => this.parentNode.multiple
      },

      options: {
        readonly: true,
        default: []
      },

      selectedIndices: {
        readonly: true,
        get: () => {
          let array = []

          for (let option of this.selectedOptions) {
            array.push(option.index)
          }

          return array
        }
      },

      selectedOptions: {
        readonly: true,
        get: () => {
          let nodes = this.querySelectorAll('[selected]')
          let AuthorHTMLCollection = this.PRIVATE.generateAuthorHTMLCollectionConstructor()
          return new AuthorHTMLCollection(nodes)
        }
      },

      Selection: {
        readonly: true,
        private: true,
        default: class {
          constructor (options = []) {
            this.options = options
          }

          get displayElements () {
            return this.options.map(option => option.displayElement)
          }

          get length () {
            return this.options.length
          }

          get first () {
            return this.options[0]
          }

          get last () {
            return this.options[this.options.length - 1]
          }

          append (option) {
            this.options.push(option)
          }

          clear () {
            this.options = []
          }

          includes (option) {
            return this.options.includes(option)
          }

          prepend (option) {
            this.options.unshift(option)
          }

          selectAll () {
            this.options.forEach(option => option.selected = true)
          }
        }
      },

      selectionStartIndex: {
        private: true
      }
    })

    this.UTIL.definePrivateMethods({
      arrowDownHandler: evt => {
        if (!this.multiple) {
          let { startIndex } = evt.detail

          switch (startIndex) {
            case this.options.length - 1:
              return

            default:
              return this.hoverOption(startIndex + 1)
          }

          return
        }

        let { lastSelectedIndex } = this.PRIVATE

        if (lastSelectedIndex === this.options.length - 1) {
          return
        }

        return this.emit('option.selected', {
          index: lastSelectedIndex === null ? 0 : lastSelectedIndex + 1,
          keyboard: true,
          shiftKey: evt.detail.shiftKey,
          ctrlKey: false,
          metaKey: false
        })
      },

      arrowUpHandler: evt => {
        if (!this.multiple) {
          let { startIndex } = evt.detail

          switch (startIndex) {
            case -1:
            case 0:
              return

            default:
              return this.hoverOption(startIndex - 1)
          }

          return
        }

        let { lastSelectedIndex } = this.PRIVATE

        if (lastSelectedIndex === 0) {
          return
        }

        return this.emit('option.selected', {
          index: lastSelectedIndex === null ? this.options.length - 1 : lastSelectedIndex - 1,
          keyboard: true,
          shiftKey: evt.detail.shiftKey,
          ctrlKey: false,
          metaKey: false
        })
      },

      diffSelections: (comparator, comparable) => {
        return comparator.filter(option => !comparable.includes(option))
      },

      generateAuthorHTMLCollectionConstructor () {
        let _p = new WeakMap()

        return class AuthorHTMLCollection {
          constructor (arr) {
            _p.set(this, {arr})
            arr.forEach((node, index) => {
              this[index] = node

              if (node.id) {
                this[node.id] = node
              }
            })
          }

          get length () {
            return _p.get(this).arr.length
          }

          item (index) {
            return _p.get(this).arr[index]
          }

          namedItem (name) {
            let matches = _p.get(this).arr.filter(item => item.id === name || item.name === name)
            return matches.length > 0 ? matches[0] : null
          }

          [Symbol.iterator] () {
            let index = 0

            return {
              next: () => {
                let result = {
                  value: _p.get(this).arr[index],
                  done: !(index in _p.get(this).arr)
                }

                index++

                return result
              }
            }
          }

          [Symbol.toStringTag] () {
            return 'AuthorHTMLCollection'
          }
        }
      },

      generateAuthorHTMLOptionsCollectionConstructor: () => {
        let _p = new WeakMap()

        let AuthorHTMLOptionsCollection = class AuthorHTMLOptionsCollection extends this.PRIVATE.generateAuthorHTMLCollectionConstructor() {
          constructor (arr, selectedIndex = -1, add, remove) {
            super(arr)
            this.selectedIndex = selectedIndex
            this.add = add
            this.remove = remove

            _p.set(this, {arr})
          }

          [Symbol.toStringTag] () {
            return 'AuthorHTMLOptionsCollection'
          }
        }

        return AuthorHTMLOptionsCollection
      },

      generateOptgroup: optgroup => {
        if (!customElements.get('author-optgroup')) {
          return this.UTIL.throwError({
            type: 'dependency',
            vars: { name: 'author-optgroup' }
          })
        }

        let surrogate = document.createElement('author-optgroup')
        surrogate.id = this.UTIL.generateGuid('optgroup')

        let label = optgroup.getAttribute('label')

        if (!label || label.trim() === '') {
          return this.UTIL.throwError({
            message: '<optgroup> must have a label attribute!'
          })
        }

        surrogate.setAttribute('label', label)

        let options = optgroup.querySelectorAll('option')

        for (let option of options) {
          this.addOption(this.PRIVATE.generateOptionObject(option), null, surrogate)
        }

        return surrogate
      },

      generateOptionObject: sourceElement => {
        if (!customElements.get('author-option')) {
          return this.UTIL.throwError({
            type: 'dependency',
            vars: { name: 'author-option' }
          })
        }

        let OptionConstructor = this.PRIVATE.generateOptionConstructor()
        return new OptionConstructor(this, this.UTIL.generateGuid(), sourceElement, document.createElement('author-option'))
      },

      generateOptionConstructor: () => {
        let _p = new WeakMap()

        return class AuthorOptionObject {
          constructor (parent, key, sourceElement, displayElement) {
            this.key = key
            this.form = parent.form
            this.defaultSelected = sourceElement.selected

            this.sourceElement = sourceElement
            this.displayElement = displayElement
            this.displayElement.parent = parent
            this.displayElement.selected = sourceElement.selected
            this.displayElement.defaultSelected = sourceElement.selected
            this.displayElement.innerHTML = sourceElement.innerHTML

            // Add additional attributes
            for (let attr of sourceElement.attributes) {
              if (typeof attr.value === 'boolean') {
                attr.value ? this.displayElement.setAttribute(attr.name, '') : this.displayElement.removeAttribute(attr.name)
                continue
              }

              this.displayElement.setAttribute(attr.name, attr.value)
            }

            _p.set(this, {
              attributes: {
                disabled: sourceElement.disabled,
                id: sourceElement.getAttribute('id'),
                label: sourceElement.getAttribute('label') || sourceElement.textContent.trim(),
                selected: sourceElement.selected,
                value: sourceElement.hasAttribute('value') ? sourceElement.getAttribute('value').trim() : null,
                text: sourceElement.text.trim()
              }
            })
          }

          get disabled () {
            return _p.get(this).attributes.disabled
          }

          set disabled (bool) {
            this.setAttr('disabled', bool)
          }

          get index () {
            return this.sourceElement.index
          }

          get id () {
            return _p.get(this).attributes.id
          }

          set id (id) {
            this.setAttr('id', id)
          }

          get selected () {
            return _p.get(this).attributes.selected
          }

          set selected (bool) {
            this.setAttr('selected', bool)
          }

          get label () {
            return _p.get(this).attributes.label
          }

          set label (label) {
            this.setAttr('label', label)
          }

          get text () {
            return _p.get(this).attributes.text
          }

          set text (text) {
            this.setAttr('text', text)
          }

          get value () {
            return _p.get(this).attributes.value
          }

          set value (value) {
            this.setAttr('value', value)
          }

          remove () {
            this.sourceElement.remove()
            this.displayElement.remove()
          }

          setAttr (name, value) {
            this.sourceElement[name] = value

            if (typeof value === 'boolean') {
              value ? this.displayElement.setAttribute(name, '') : this.displayElement.removeAttribute(name)
            } else {
              this.displayElement.setAttribute(name, value)
            }

            _p.get(this).attributes[name] = value
          }
        }
      },

      getCurrentSelection: () => this.options.filter(option => option.selected),

      handleClickSelection: (detail, cb) => {
        let {
          cherryPicked,
          getCurrentSelection,
          lastSelectedIndex,
          Selection,
          selectionStartIndex
        } = this.PRIVATE

        let { index, shiftKey, ctrlKey, metaKey } = detail
        let selectedOption = this.options[index]

        if (shiftKey && lastSelectedIndex !== null) {
          this.PRIVATE.lastSelectedIndex = index
          this.PRIVATE.cherryPicked.clear()
          let bounds = [index, selectionStartIndex].sort((a, b) => a - b)
          return cb(new Selection(bounds[0] === bounds[1] ? [selectedOption] : this.options.slice(bounds[0], bounds[1] + 1)))
        }

        let currentSelection = getCurrentSelection()

        if (ctrlKey || metaKey) {
          this.PRIVATE.lastSelectedIndex = index
          this.PRIVATE.selectionStartIndex = index

          this.PRIVATE.cherryPicked.options = selectedOption.selected ? currentSelection.filter(option => option !== selectedOption) : this.options.filter(option => option === selectedOption || currentSelection.includes(option))
          return cb(this.PRIVATE.cherryPicked)
        }

        if (currentSelection.length === 1 && index === lastSelectedIndex) {
          return
        }

        this.PRIVATE.lastSelectedIndex = index
        this.PRIVATE.selectionStartIndex = index
        this.PRIVATE.cherryPicked.clear()
        return cb(new Selection([selectedOption]))
      },

      handleKeyboardSelection: (detail, cb) => {
        let {
          cherryPicked,
          getCurrentSelection,
          Selection,
          selectionStartIndex
        } = this.PRIVATE

        let { index, shiftKey } = detail
        let selectedOption = this.options[index]
        let currentSelection = getCurrentSelection()

        this.PRIVATE.lastSelectedIndex = index

        if (!shiftKey || currentSelection.length === 0) {
          this.PRIVATE.selectionStartIndex = index
          this.PRIVATE.cherryPicked.clear()
          return cb(new Selection([selectedOption]))
        }

        // 1 option or more selected
        if (currentSelection.length > 0) {
          let bounds = [index, selectionStartIndex].sort()
          let selection = new Selection(bounds[0] === bounds[1] ? [selectedOption] : this.options.slice(bounds[0], bounds[1] + 1))

          if (cherryPicked.length > 0) {
            selection.options = this.options.filter(option => selection.includes(option) || cherryPicked.includes(option))
          }

          return cb(selection)
        }
      },

      optionSelectionHandler: evt => {
        let {
          cherryPicked,
          diffSelections,
          getCurrentSelection,
          generateAuthorHTMLCollectionConstructor,
          handleClickSelection,
          handleKeyboardSelection,
          Selection
        } = this.PRIVATE

        if (cherryPicked === null) {
          this.PRIVATE.cherryPicked = new Selection([])
        }

        let { index, keyboard } = evt.detail

        let completeOperation = selection => {
          let currentSelection = getCurrentSelection()
          let comparator = selection.length >= currentSelection.length ? selection.options : currentSelection
          let diff = diffSelections(comparator, comparator === currentSelection ? selection.options : currentSelection)

          if (diff.length === 0) {
            return
          }

          let { beforeChange } = this.parentNode

          let detail = {
            options: selection.options,
            previous: this.selectedOptions,
            next: new (generateAuthorHTMLCollectionConstructor())(selection.displayElements)
          }

          let cb = () => {
            this.deselectAll()
            selection.selectAll()
            return this.emit('options.selected', detail, this.parentNode)
          }

          if (!(beforeChange && typeof beforeChange === 'function')) {
            return cb()
          }

          beforeChange(this.selectedOptions, detail.next, cb)
        }

        if (!this.multiple) {
          return completeOperation(new Selection([this.options[index]]))
        }

        if (keyboard) {
          return this.PRIVATE.handleKeyboardSelection(evt.detail, completeOperation)
        }

        return this.PRIVATE.handleClickSelection(evt.detail, completeOperation)
      },

      parentStateChangeHandler: evt => {
        this.emit('state.change', evt.detail)

        let { name, value } = evt.detail

        switch (name) {
          case 'multiple':
            if (!value && this.selectedOptions.length > 0) {
              let index = this.selectedIndex

              this.deselectAll()
              this.emit('option.selected', { index })
            }

            break

          default: return
        }
      },
    })

    this.UTIL.registerListeners(this, {
      connected: () => {
        this.PRIVATE.selectionStartIndex = this.selectedIndex >= 0 ? this.selectedIndex : 0
        this.parentNode.on('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      disconnected: () => {
        this.parentNode.off('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      'keydown.arrowUp': this.PRIVATE.arrowUpHandler,
      'keydown.arrowDown': this.PRIVATE.arrowDownHandler,
      'option.selected': this.PRIVATE.optionSelectionHandler
    })
  }

  get selectedIndex () {
    return this.selectedOptions.length > 0
      ? this.selectedOptions.item(0).index
      : null
  }

  set selectedIndex (index) {
    this.emit('option.selected', { index })
  }

  get selectionStartIndex () {
    return this.PRIVATE.selectionStartIndex
  }

  set selectionStartIndex (value) {
    this.UTIL.throwError({
      type: 'readonly',
      message: `"selectionStartIndex" cannot be set manually.`
    })
  }

  addOptgroup (optgroup) {
    let label = document.createElement('author-optgroup-label')
    label.innerHTML = optgroup.getAttribute('label')

    this.appendChild(label)
    this.appendChild(optgroup)
  }

  addOption (option, index = null, dest = this) {
    if (!customElements.get('author-option')) {
      return this.UTIL.throwError({
        type: 'dependency',
        vars: {
          name: 'author-option'
        }
      })
    }

    if (option instanceof Option) {
      option = this.PRIVATE.generateOptionObject(option)
    }

    this.parentNode[`${option.index}`] = option.displayElement

    if (index) {
      dest.insertBefore(option.displayElement, dest.children.item(index))

      this.options.splice(index, 0, option)
      this.parentNode.sourceElement.add(option.sourceElement, index)

    } else {
      dest.appendChild(option.displayElement)
      this.options.push(option)

      if (!this.parentNode.sourceElement[this.options.length - 1]) {
        this.parentNode.sourceElement.appendChild(option.sourceElement)
      }
    }

    if (option.selected) {
      if (!this.multiple) {
        this.selectedIndex = option.index
        return
      }
    }
  }

  addOptions (children) {
    for (let child of children) {
      let isElement = child instanceof HTMLElement

      switch (child.nodeName) {
        case 'OPTION':
          this.addOption(isElement ? this.PRIVATE.generateOptionObject(child) : child)
          continue

        case 'OPTGROUP':
          this.addOptgroup(isElement ? this.PRIVATE.generateOptgroup(child) : child)
          continue

        default:
          this.UTIL.printToConsole(`${child.nodeName.toLowerCase()} is not a valid child element for <author-select>. Removing...`, 'warning')
      }
    }
  }

  clear () {
    while (this.lastChild) {
      this.removeChild(this.lastChild)
    }
  }

  deselect (option, updateList = true) {
    if (typeof option === 'number') {
      option = this.options[option]
    }

    option.selected = false
    this.parentNode.selectedOptionsElement.remove(option, updateList)
  }

  deselectAll (showPlaceholder = true) {
    this.options.filter(option => option.selected).forEach((option, index, options) => {
      this.deselect(option, index = options.length - 1 && showPlaceholder)
    })
  }

  hoverOption (index) {
    this.unHoverAllOptions()
    this.options[index].displayElement.hover = true
  }

  item (index) {
    return this.options[index].displayElement
  }

  namedItem (value) {
    let query = this.options.filter(option => {
      let id = option.sourceElement.attributes.getNamedItem('id')
      return id && id.value === value
    })

    if (!query.length) {
      return null
    }

    return query[query.length - 1].displayElement
  }

  /**
   * @method removeOptionByIndex
   * @param  {Number}  [index=null]
   * Index of option to remove
   * @param  {Boolean} [destroy=true]
   */
  removeOptionByIndex (index = null) {
    if (index === null || index >= this.options.length) {
      return
    }

    this.options[index].remove()
  }

  unHoverAllOptions () {
    this.options.forEach((option, index) => this.unHoverOption(index))
  }

  unHoverOption (index) {
    this.options[index].displayElement.hover = false
  }
}

customElements.define('author-options', AuthorOptionsElement)
