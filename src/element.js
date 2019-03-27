class AuthorSelectElement extends AuthorMenuElement {
  constructor () {
    super(`{{TEMPLATE-STRING}}`)

    this.UTIL.defineProperties({
      selectedOptionsElement: {
        readonly: true,
        get: () => this.querySelector('author-selected-options')
      },

      type: {
        readonly: true,
        get: () => this.multiple ? 'select-multiple' : 'select-one'
      }
    })

    this.UTIL.defineAttributes({
      multiple: false
    })

    this.UTIL.registerListeners(this, {
      'attribute.change': evt => {
        let { attribute, oldValue, newValue } = evt.detail

        if (newValue === oldValue) {
          return
        }

        switch (attribute) {
          case 'multiple': return this.emit('state.change', {
            name: 'multiple',
            value: this.multiple
          })

          case 'placeholder':
            if (this.selectedOptionsElement) {
              this.selectedOptionsElement.update()
            }

            break
        }
      },

      'options.selected': evt => this.emit('options.selected', evt.detail.options, this.selectedOptionsElement)
    })
  }

  static get observedAttributes () {
    return [...AuthorMenuElement.observedAttributes, 'multiple']
  }

  clear () {
    super.clear()
    this.selectedOptionsElement.clear()
  }

  inject (sourceElement, labels = null) {
    super.inject(sourceElement, labels)

    if (sourceElement.localName === 'select') {
      let selectedOptionsElement = document.createElement('author-selected-options')
      selectedOptionsElement.slot = 'selectedoptions'
      this.appendChild(selectedOptionsElement)

      if (!this.multiple) {
        this.selectedOptionsElement.add(this.optionsElement.options[this.selectedIndex])
      }
    }
  }
}

customElements.define('author-select', AuthorSelectElement)

export default AuthorSelectElement
